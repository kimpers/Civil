import * as React from "react";
import { compose } from "redux";
import BigNumber from "bignumber.js";
import { TwoStepEthTransaction, TxHash } from "@joincivil/core";
import {
  ChallengeCommitVoteCard,
  ModalContent,
  ModalUnorderedList,
  ModalListItem,
  ReviewVote,
  ReviewVoteProps,
} from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { commitVote, approveVotingRights } from "../../apis/civilTCR";
import { fetchSalt } from "../../helpers/salt";
import { saveVote } from "../../helpers/vote";
import { InjectedTransactionStatusModalProps, hasTransactionStatusModals } from "../utility/TransactionStatusModalsHOC";
import { ChallengeDetailProps, ChallengeVoteState } from "./ChallengeDetail";

enum TransactionTypes {
  APPROVE_VOTING_RIGHTS = "APPROVE_VOTING_RIGHTS",
  COMMIT_VOTE = "COMMIT_VOTE",
}

const transactionLabels = {
  [TransactionTypes.APPROVE_VOTING_RIGHTS]: "Approve Voting Rights",
  [TransactionTypes.COMMIT_VOTE]: "Commit Vote",
};

const multiStepTransactionLabels = {
  [TransactionTypes.APPROVE_VOTING_RIGHTS]: "1 of 2",
  [TransactionTypes.COMMIT_VOTE]: "2 of 2",
};

const transactionSuccessContent = {
  [TransactionTypes.APPROVE_VOTING_RIGHTS]: [undefined, undefined],
  [TransactionTypes.COMMIT_VOTE]: [
    "Your vote was committed!",
    <>
      <ModalContent>
        Please keep your secret phrase safe. You will need it to confirm your vote. Votes can not be counted and rewards
        can not be claimed unless you confirm them.
      </ModalContent>
    </>,
  ],
};

const transactionRejectionContent = {
  [TransactionTypes.APPROVE_VOTING_RIGHTS]: [
    "Your vote was not committed",
    "Before committing a vote, you need to confirm the approval of your voting token deposit in your MetaMask wallet.",
  ],
  [TransactionTypes.COMMIT_VOTE]: [
    "Your vote was not committed",
    "To commit a vote, you need to confirm the transaction in your MetaMask wallet.",
  ],
};

const transactionErrorContent = {
  [TransactionTypes.APPROVE_VOTING_RIGHTS]: [
    "The was an problem with commiting your vote",
    <>
      <ModalContent>Please check the following and retry your transaction</ModalContent>
      <ModalUnorderedList>
        <ModalListItem>The number of tokens you are voting with does not exceed your available balance.</ModalListItem>
      </ModalUnorderedList>
    </>,
  ],
  [TransactionTypes.COMMIT_VOTE]: [
    "The was an problem with commiting your vote",
    <>
      <ModalContent>Please retry your transaction</ModalContent>
    </>,
  ],
};

const transactionStatusModalConfig = {
  transactionLabels,
  multiStepTransactionLabels,
  transactionSuccessContent,
  transactionRejectionContent,
  transactionErrorContent,
};

class ChallengeCommitVote extends React.Component<
  ChallengeDetailProps & InjectedTransactionStatusModalProps,
  ChallengeVoteState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      isReviewVoteModalOpen: false,
      voteOption: undefined,
      salt: fetchSalt(this.props.challengeID, this.props.user),
      numTokens: undefined,
    };
  }

  public componentWillMount(): void {
    this.props.setTransactions(this.getTransactions());
    this.props.setHandleTransactionSuccessButtonClick(this.handleCommitVoteSuccessClose);
  }

  public render(): JSX.Element | null {
    const endTime = this.props.challenge.poll.commitEndDate.toNumber();
    const phaseLength = this.props.parameters.commitStageLen;
    const challenge = this.props.challenge;
    const tokenBalance = this.props.balance ? this.props.balance.div(1e18).toNumber() : 0;
    const votingTokenBalance = this.props.votingBalance ? this.props.votingBalance.div(1e18).toNumber() : 0;
    const tokenBalanceDisplay = this.props.balance ? getFormattedTokenBalance(this.props.balance) : "";
    const votingTokenBalanceDisplay = this.props.votingBalance
      ? getFormattedTokenBalance(this.props.votingBalance)
      : "";
    const userHasCommittedVote = this.props.userChallengeData && !!this.props.userChallengeData.didUserCommit;
    if (!challenge) {
      return null;
    }
    const props = {
      endTime,
      phaseLength,
      challenger: challenge!.challenger.toString(),
      challengeID: this.props.challengeID.toString(),
      rewardPool: getFormattedTokenBalance(challenge!.rewardPool),
      stake: getFormattedTokenBalance(challenge!.stake),
      userHasCommittedVote,
      onInputChange: this.updateCommitVoteState,
      onCommitMaxTokens: () => this.commitMaxTokens(),
      onReviewVote: this.handleReviewVote,
      tokenBalance,
      votingTokenBalance,
      tokenBalanceDisplay,
      votingTokenBalanceDisplay,
      salt: this.state.salt,
      numTokens: this.state.numTokens,
    };
    return (
      <>
        <ChallengeCommitVoteCard {...props} />
        {this.renderReviewVoteModal()}
      </>
    );
  }

  private commitMaxTokens(): void {
    let numTokens: BigNumber;
    if (!this.props.votingBalance!.isZero()) {
      numTokens = this.props.votingBalance!;
    } else {
      numTokens = this.props.balance!.add(this.props.votingBalance!);
    }
    const numTokensString = numTokens
      .div(1e18)
      .toFixed(2)
      .toString();
    this.setState(() => ({ numTokens: numTokensString }));
  }

  private renderReviewVoteModal(): JSX.Element {
    if (!this.props.parameters) {
      return <></>;
    }

    const { challenge } = this.props;
    const listingDetailURL = `https://${window.location.hostname}/listing/${this.props.listingAddress}`;

    const props: ReviewVoteProps = {
      newsroomName: this.props.newsroom && this.props.newsroom.data.name,
      listingDetailURL,
      challengeID: this.props.challengeID.toString(),
      open: this.state.isReviewVoteModalOpen!,
      salt: this.state.salt,
      numTokens: this.state.numTokens,
      voteOption: this.state.voteOption,
      userAccount: this.props.user,
      commitEndDate: challenge.poll.commitEndDate.toNumber(),
      revealEndDate: challenge.poll.revealEndDate.toNumber(),
      transactions: this.getTransactions(),
      handleClose: this.closeReviewVoteModal,
    };

    return <ReviewVote {...props} />;
  }

  private getTransactions = (): any => {
    return [
      {
        transaction: async () => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            transactionType: TransactionTypes.APPROVE_VOTING_RIGHTS,
          });
          return this.approveVotingRights();
        },
        handleTransactionHash: (txHash: TxHash) => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: false,
            isTransactionProgressModalOpen: true,
          });
        },
        handleTransactionError: this.props.handleTransactionError,
      },
      {
        transaction: async () => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            transactionType: TransactionTypes.COMMIT_VOTE,
          });
          return this.commitVoteOnChallenge();
        },
        handleTransactionHash: (txHash: TxHash) => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: false,
            isTransactionProgressModalOpen: true,
          });
        },
        postTransaction: () => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: false,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: true,
          });
        },
        handleTransactionError: this.props.handleTransactionError,
      },
    ];
  };

  private updateCommitVoteState = (data: any, callback?: () => void): void => {
    if (callback) {
      this.setState({ ...data }, callback);
    } else {
      this.setState({ ...data });
    }
  };

  private handleReviewVote = () => {
    this.setState({ isReviewVoteModalOpen: true });
  };

  private closeReviewVoteModal = () => {
    this.setState({ isReviewVoteModalOpen: false });
  };

  private handleCommitVoteSuccessClose = () => {
    this.props.updateTransactionStatusModalsState({ isTransactionSuccessModalOpen: false });
    this.setState({ isReviewVoteModalOpen: false });
  };

  private approveVotingRights = async (): Promise<TwoStepEthTransaction<any> | void> => {
    const numTokens: BigNumber = new BigNumber(this.state.numTokens as string).mul(1e18);
    return approveVotingRights(numTokens);
  };

  private commitVoteOnChallenge = async (): Promise<TwoStepEthTransaction<any>> => {
    const voteOption: BigNumber = new BigNumber(this.state.voteOption as string);
    const salt: BigNumber = new BigNumber(this.state.salt as string);
    const numTokens: BigNumber = new BigNumber(this.state.numTokens as string).mul(1e18);
    saveVote(this.props.challengeID, this.props.user, voteOption);
    return commitVote(this.props.challengeID, voteOption, salt, numTokens);
  };
}

export default compose<React.ComponentClass<ChallengeDetailProps>>(
  hasTransactionStatusModals(transactionStatusModalConfig),
)(ChallengeCommitVote);
