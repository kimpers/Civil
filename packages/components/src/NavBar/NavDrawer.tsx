import * as React from "react";
import * as ReactDOM from "react-dom";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";
import { Button, buttonSizes } from "../Button";
import {
  NavDrawerUserAddessText,
  NavDrawerBalanceText,
  NavDrawerTotalBalanceText,
  NavDrawerVotingBalanceText,
  NavDrawerVotingBalanceToolTipText,
  NavDrawerCopyBtnText,
  NavDrawerBuyCvlBtnText,
  NavDrawerDashboardText,
  NavDrawerRevealVotesText,
  NavDrawerClaimRewardsText,
  NavDrawerSubmittedChallengesText,
  NavDrawerVotedChallengesText,
  NavDrawerLoadingPrefText,
} from "./textComponents";
import { QuestionToolTip } from "../QuestionToolTip";
import { LoadingPrefToggle } from "./LoadingPrefToggle";

const StyledNavDrawer = styled.div`
  background-color: ${colors.primary.BLACK};
  bottom: 0;
  min-height: 100%;
  position: fixed;
  overflow-y: scroll;
  padding-bottom: 100px;
  top: 62px;
  right: 0;
  width: 275px;
  z-index: 1;
  * {
    box-sizing: border-box;
  }
`;

const NavDrawerSection = styled.div`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_1};
  color: ${colors.accent.CIVIL_GRAY_2};
  font-family: ${fonts.SANS_SERIF};
  padding: 30px 25px;
`;

const NavDrawerSectionHeader = styled.div`
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.92px;
  margin-bottom: 20px;
  text-transform: uppercase;
`;

const NavDrawerRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const NavDrawerRowLabel = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  font-weight: 500;
  line-height: 17px;
`;

const NavDrawerRowInfo = styled.div`
  text-align: right;
  width: 75%;
`;

const NavDrawerPill = styled.div`
  background-color: ${colors.accent.CIVIL_BLUE};
  border-radius: 12px;
  color: ${colors.basic.WHITE};
  font-size: 14px;
  font-weight: 200;
  min-width: 28px;
  padding: 5px 8px;
  text-align: center;
`;

const NavDrawerCvlBalance = styled.div`
  color: ${colors.basic.WHITE};
  font-size: 16px;
  font-weight: 600;
  line-height: 19px;
`;

const UserAddress = styled.span`
  color: ${colors.basic.WHITE};
  font-family: ${fonts.MONOSPACE};
  font-size: 16px;
  font-weight: 800;
  line-height: 26px;
  word-wrap: break-word;
`;

const NavDrawerBuyCvlBtn = styled(Button)`
  font-weight: 600;
  margin-top: 20px;
  padding: 15px;
  text-align: center;
  width: 100%;
`;

const CopyButton = styled(Button)`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1px;
  margin-top: 10px;
  padding: 5px;
`;

export interface NavDrawerProps {
  balance: string;
  votingBalance: string;
  userAccount: string;
  userRevealVotesCount?: number;
  userChallengesVotedOnCount?: number;
  userChallengesStartedCount?: number;
  userClaimRewardsCount?: number;
  buyCvlUrl?: string;
  useGraphQL: boolean;
  onLoadingPrefToggled(): void;
}

class NavDrawerComponent extends React.Component<NavDrawerProps> {
  public render(): JSX.Element {
    return (
      <StyledNavDrawer>
        <NavDrawerSection>
          <NavDrawerSectionHeader>
            <NavDrawerUserAddessText />
          </NavDrawerSectionHeader>
          <UserAddress>{this.props.userAccount}</UserAddress>
          <CopyButton size={buttonSizes.SMALL} onClick={ev => this.copyToClipBoard()}>
            <NavDrawerCopyBtnText />
          </CopyButton>
        </NavDrawerSection>
        <NavDrawerSection>
          <NavDrawerRowLabel>
            <NavDrawerLoadingPrefText />
          </NavDrawerRowLabel>
          <LoadingPrefToggle onClick={this.props.onLoadingPrefToggled} useGraphQL={this.props.useGraphQL} />
        </NavDrawerSection>
        <NavDrawerSection>
          <NavDrawerSectionHeader>
            <NavDrawerBalanceText />
          </NavDrawerSectionHeader>
          <NavDrawerRow>
            <NavDrawerRowLabel>
              <NavDrawerTotalBalanceText />
            </NavDrawerRowLabel>
            <NavDrawerRowInfo>
              <NavDrawerCvlBalance>{this.props.balance}</NavDrawerCvlBalance>
            </NavDrawerRowInfo>
          </NavDrawerRow>
          <NavDrawerRow>
            <NavDrawerRowLabel>
              <NavDrawerVotingBalanceText />
              <QuestionToolTip explainerText={<NavDrawerVotingBalanceToolTipText />} />
            </NavDrawerRowLabel>
            <NavDrawerRowInfo>
              <NavDrawerCvlBalance>{this.props.votingBalance}</NavDrawerCvlBalance>
            </NavDrawerRowInfo>
          </NavDrawerRow>
          <NavDrawerBuyCvlBtn size={buttonSizes.SMALL} href={this.props.buyCvlUrl}>
            <NavDrawerBuyCvlBtnText />
          </NavDrawerBuyCvlBtn>
        </NavDrawerSection>
        <NavDrawerSection>
          <NavDrawerSectionHeader>
            <NavDrawerDashboardText />
          </NavDrawerSectionHeader>
          <NavDrawerRow>
            <NavDrawerRowLabel>
              <NavDrawerRevealVotesText />
            </NavDrawerRowLabel>
            <NavDrawerPill>{this.props.userRevealVotesCount || 0}</NavDrawerPill>
          </NavDrawerRow>
          <NavDrawerRow>
            <NavDrawerRowLabel>
              <NavDrawerClaimRewardsText />
            </NavDrawerRowLabel>
            <NavDrawerPill>{this.props.userClaimRewardsCount || 0}</NavDrawerPill>
          </NavDrawerRow>
          <NavDrawerRow>
            <NavDrawerRowLabel>
              <NavDrawerSubmittedChallengesText />
            </NavDrawerRowLabel>
            <NavDrawerPill>{this.props.userChallengesStartedCount || 0}</NavDrawerPill>
          </NavDrawerRow>
          <NavDrawerRow>
            <NavDrawerRowLabel>
              <NavDrawerVotedChallengesText />
            </NavDrawerRowLabel>
            <NavDrawerPill>{this.props.userChallengesVotedOnCount || 0}</NavDrawerPill>
          </NavDrawerRow>
        </NavDrawerSection>
      </StyledNavDrawer>
    );
  }

  private copyToClipBoard = () => {
    const textArea = document.createElement("textarea");
    const userAccount = this.props.userAccount || "";
    textArea.innerText = userAccount;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
  };
}

export class NavDrawer extends React.Component<NavDrawerProps> {
  public bucket: HTMLDivElement = document.createElement("div");

  public componentDidMount(): void {
    document.body.appendChild(this.bucket);
  }

  public componentWillUnmount(): void {
    document.body.removeChild(this.bucket);
  }

  public render(): React.ReactPortal {
    return ReactDOM.createPortal(<NavDrawerComponent {...this.props} />, this.bucket);
  }
}
