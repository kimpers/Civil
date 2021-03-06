import { EthAddress } from "@joincivil/core";

export interface ListingDetailPhaseCardComponentProps {
  challenge?: any;
  listing?: any;
  listingAddress?: EthAddress;
  transactions?: any[];
  constitutionURI?: string;
  modalContentComponents?: any;
}

export interface PhaseWithExpiryProps {
  endTime: number;
  phaseLength: number;
  secondaryPhaseLength?: number;
}

export interface SubmitChallengeProps {
  submitChallengeURI?: string;
}

export interface RequestAppealProps {
  requestAppealURI?: string;
}

export interface ChallengePhaseProps {
  challengeID?: string;
  isViewingUserChallenger?: boolean;
  challenger: EthAddress;
  rewardPool: string;
  stake: string;
  userHasCommittedVote?: boolean;
  userHasRevealedVote?: boolean;
}

export interface CommitVoteProps {
  newsroomName?: string;
  tokenBalance: number;
  votingTokenBalance: number;
  tokenBalanceDisplay: string;
  votingTokenBalanceDisplay: string;
  salt?: string;
  numTokens?: string;
  userHasCommittedVote?: boolean;
  userHasRevealedVote?: boolean;
  buttonText?: string | JSX.Element;
  onCommitMaxTokens(): void;
  onInputChange(propsData: any, validateFn?: () => boolean): void;
  onReviewVote(): void;
  postExecuteTransactions?(): any;
}

export interface RevealVoteProps {
  newsroomName?: string;
  salt: string | undefined;
  voteOption: string | undefined;
  transactions: any[];
  modalContentComponents?: any;
  onInputChange(propsData: any, validateFn?: () => boolean): void;
  postExecuteTransactions?(): any;
}

export interface AppealDecisionProps {
  appealGranted: boolean;
}

export interface AppealChallengePhaseProps {
  appealChallengeID: string;
}
