import * as React from "react";
import styled from "styled-components";
import { connect, DispatchProp } from "react-redux";
import { BigNumber } from "bignumber.js";
import {
  Button,
  buttonSizes,
  colors,
  fonts,
  Table,
  Tr,
  Td,
  Th,
  Tabs,
  Tab,
  StyledDashboardSubTab,
  MinDepositLabelText,
  ParamMinDepositLabelText,
  ApplicationStageLenLabelText,
  ParamApplicationStageLenLabelText,
  CommitStageLenLabelText,
  ParamCommitStageLenLabelText,
  RevealStageLenLabelText,
  ParamRevealStageLenLabelText,
  DispensationPctLabelText,
  ParamDispensationPctLabelText,
  VoteQuorumLabelText,
  ParamVoteQuorumLabelText,
  ParamProcessByLabelText,
  ChallengeAppealLenLabelText,
  ChallengeAppealCommitStageLenLabelText,
  ChallengeAppealRevealStageLenLabelText,
  RequestAppealLenLabelText,
  JudgeAppealLenLabelText,
  AppealFeeLabelText,
  AppealVotePercentageLabelText,
} from "@joincivil/components";
import { State } from "../reducers";
import { ProposeReparameterization } from "./parameterizer/proposeReparameterization";
import { GovernmentReparameterization } from "./parameterizer/GovernmentReparameterization";
import Proposals from "./parameterizer/Proposals";
import { getFormattedTokenBalance, getReadableDuration, Parameters, GovernmentParameters } from "@joincivil/utils";
import ListingDiscourse from "./listing/ListingDiscourse";
import { getCivil } from "../helpers/civilInstance";

const GridRow = styled.div`
  display: flex;
  margin: 40px auto 0;
  padding: 0 0 20px;
  width: 1200px;

  & ~ & {
    margin-top: 0;
  }
`;

const GridRowStatic = styled.div`
  margin: 0 auto;
  width: 1200px;
`;

const StyledTabContainer = styled.div`
  padding: 30px 0 50px;
`;

const StyledTitle = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-family: ${fonts.SERIF};
  font-size: 48px;
  font-weight: 200;
  margin: 0;
  line-height: 40px;
  letter-spacing: -0.19px;
  width: 350px;
`;

const StyledDescriptionP = styled.p`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-size: 18px;
  line-height: 33px;
  letter-spacing: -0.12px;
  width: 730px;
`;

const StyledP = styled.p`
  color: ${colors.primary.CIVIL_GRAY_1}
  font-size: 16px;
  line-height: 20px;
  letter-spacing: -0.11px;
`;

export interface ParameterizerProps {
  [Parameters.minDeposit]: BigNumber;
  [Parameters.pMinDeposit]: BigNumber;
  [Parameters.applyStageLen]: BigNumber;
  [Parameters.pApplyStageLen]: BigNumber;
  [Parameters.commitStageLen]: BigNumber;
  [Parameters.pCommitStageLen]: BigNumber;
  [Parameters.revealStageLen]: BigNumber;
  [Parameters.pRevealStageLen]: BigNumber;
  [Parameters.dispensationPct]: BigNumber;
  [Parameters.pDispensationPct]: BigNumber;
  [Parameters.voteQuorum]: BigNumber;
  [Parameters.pVoteQuorum]: BigNumber;
  [Parameters.pProcessBy]: BigNumber;
  [Parameters.challengeAppealLen]: BigNumber;
  [Parameters.challengeAppealCommitLen]: BigNumber;
  [Parameters.challengeAppealRevealLen]: BigNumber;
}

export interface GovernmentParameterProps {
  [GovernmentParameters.requestAppealLen]: BigNumber;
  [GovernmentParameters.judgeAppealLen]: BigNumber;
  [GovernmentParameters.appealFee]: BigNumber;
  [GovernmentParameters.appealVotePercentage]: BigNumber;
}

export interface ParameterizerPageProps {
  parameters: ParameterizerProps;
  govtParameters: GovernmentParameterProps;
}

class Parameterizer extends React.Component<ParameterizerPageProps & DispatchProp<any>> {
  public render(): JSX.Element {
    const civil = getCivil();

    return (
      <>
        <GridRow>
          <StyledTitle>Civil Registry Parameters</StyledTitle>
          <StyledDescriptionP>
            The Civil Registry runs on a set of rules called "parameters". These parameters control almost every
            function of the Registry's governance, from how much it costs to challenge a newsroom to how long the voting
            process will take. The Civil community has the power to propose new values for these parameters and new
            rules as the Civil platform evolves.
          </StyledDescriptionP>
        </GridRow>
        <GridRow>
          <Tabs TabComponent={StyledDashboardSubTab}>
            <Tab title="Current Parameters">
              <StyledTabContainer>
                <StyledP>
                  All Civil token holders may propose a change to the current Registry values. This process involves
                  three phases: proposal, challenge, and vote.
                </StyledP>
                <StyledP>
                  Proposing new values and challenging a proposal{" "}
                  <b>
                    requires a deposit of{" "}
                    {this.props.parameters[Parameters.pMinDeposit] &&
                      getFormattedTokenBalance(
                        civil.toBigNumber(this.props.parameters[Parameters.pMinDeposit].toString()),
                      )}
                  </b>.
                </StyledP>

                <Table width="100%">
                  <thead>
                    <Tr>
                      <Th>Current Parameter</Th>
                      <Th>Current Value</Th>
                      <Th colSpan={3} accent>
                        Proposal for New Value
                      </Th>
                    </Tr>
                  </thead>
                  <tbody>
                    {Object.keys(this.props.parameters).map(key => {
                      if (!this.props.parameters[key]) {
                        return <></>;
                      }
                      return (
                        <Parameter
                          key={key}
                          parameterName={key}
                          parameterDisplayName={this.getParameterDisplayName(key)}
                          parameterValue={this.props.parameters[key]}
                        />
                      );
                    })}
                  </tbody>
                </Table>

                <ProposeReparameterization
                  paramKeys={Object.keys(this.props.parameters)}
                  pMinDeposit={this.props.parameters.pMinDeposit && this.props.parameters.pMinDeposit.toString()}
                />
              </StyledTabContainer>
            </Tab>

            <Tab title="Government Parameters">
              <StyledTabContainer>
                <Table width="100%">
                  <thead>
                    <Tr>
                      <Th>Current Parameter</Th>
                      <Th>Current Value</Th>
                      <Th colSpan={3} accent>
                        Proposal for New Value
                      </Th>
                    </Tr>
                  </thead>
                  <tbody>
                    {Object.keys(this.props.govtParameters).map(key => {
                      if (!this.props.govtParameters[key]) {
                        return <></>;
                      }
                      return (
                        <Parameter
                          key={key}
                          parameterName={key}
                          parameterDisplayName={this.getParameterDisplayName(key)}
                          parameterValue={this.props.govtParameters[key]}
                        />
                      );
                    })}
                  </tbody>
                </Table>
                <GovernmentReparameterization paramKeys={Object.keys(this.props.govtParameters)} />
              </StyledTabContainer>
            </Tab>
          </Tabs>
        </GridRow>

        <GridRow>
          <Proposals />
        </GridRow>

        <GridRowStatic>
          <ListingDiscourse />
        </GridRowStatic>
      </>
    );
  }

  private getParameterDisplayName = (parameterName: string): JSX.Element => {
    const parameterDisplayNameMap = {
      [Parameters.minDeposit]: MinDepositLabelText,
      [Parameters.pMinDeposit]: ParamMinDepositLabelText,
      [GovernmentParameters.appealFee]: AppealFeeLabelText,

      [Parameters.applyStageLen]: ApplicationStageLenLabelText,
      [Parameters.pApplyStageLen]: ParamApplicationStageLenLabelText,
      [Parameters.commitStageLen]: CommitStageLenLabelText,
      [Parameters.pCommitStageLen]: ParamCommitStageLenLabelText,
      [Parameters.revealStageLen]: RevealStageLenLabelText,
      [Parameters.pRevealStageLen]: ParamRevealStageLenLabelText,
      [Parameters.pProcessBy]: ParamProcessByLabelText,
      [Parameters.challengeAppealLen]: ChallengeAppealLenLabelText,
      [Parameters.challengeAppealCommitLen]: ChallengeAppealCommitStageLenLabelText,
      [Parameters.challengeAppealRevealLen]: ChallengeAppealRevealStageLenLabelText,
      [GovernmentParameters.requestAppealLen]: RequestAppealLenLabelText,
      [GovernmentParameters.judgeAppealLen]: JudgeAppealLenLabelText,

      [Parameters.dispensationPct]: DispensationPctLabelText,
      [Parameters.pDispensationPct]: ParamDispensationPctLabelText,
      [Parameters.voteQuorum]: VoteQuorumLabelText,
      [Parameters.pVoteQuorum]: ParamVoteQuorumLabelText,
      [GovernmentParameters.appealVotePercentage]: AppealVotePercentageLabelText,
    };

    let DisplayName: React.SFC = props => <></>;
    if (parameterDisplayNameMap[parameterName]) {
      DisplayName = parameterDisplayNameMap[parameterName];
    }

    return <DisplayName />;
  };
}

interface ParameterProps {
  parameterName: string;
  parameterDisplayName: string | JSX.Element;
  parameterValue: BigNumber;
}

class Parameter extends React.Component<ParameterProps> {
  public render(): JSX.Element {
    return (
      <Tr>
        <Td>{this.props.parameterDisplayName}</Td>
        <Td>{this.getFormattedValue()}</Td>
        <Td accent align="right" colSpan={3}>
          <Button size={buttonSizes.SMALL}>Propose New Value</Button>
        </Td>
      </Tr>
    );
  }

  private getFormattedValue = (): string => {
    const civil = getCivil();

    const amountParams: string[] = [Parameters.minDeposit, Parameters.pMinDeposit, GovernmentParameters.appealFee];

    const durationParams: string[] = [
      Parameters.applyStageLen,
      Parameters.pApplyStageLen,
      Parameters.commitStageLen,
      Parameters.pCommitStageLen,
      Parameters.revealStageLen,
      Parameters.pRevealStageLen,
      Parameters.pProcessBy,
      Parameters.challengeAppealLen,
      Parameters.challengeAppealCommitLen,
      Parameters.challengeAppealRevealLen,
      GovernmentParameters.requestAppealLen,
      GovernmentParameters.judgeAppealLen,
    ];

    const percentParams: string[] = [
      Parameters.dispensationPct,
      Parameters.pDispensationPct,
      Parameters.voteQuorum,
      Parameters.pVoteQuorum,
      GovernmentParameters.appealVotePercentage,
    ];

    let value = "";

    if (amountParams.includes(this.props.parameterName)) {
      value = getFormattedTokenBalance(civil.toBigNumber(this.props.parameterValue.toString()));
    } else if (durationParams.includes(this.props.parameterName)) {
      value = getReadableDuration(civil.toBigNumber(this.props.parameterValue.toString()));
    } else if (percentParams.includes(this.props.parameterName)) {
      value = `${this.props.parameterValue.toString()}%`;
    }

    return value;
  };
}

const mapToStateToProps = (state: State): ParameterizerPageProps => {
  const parameters: ParameterizerProps = state.networkDependent.parameters as ParameterizerProps;
  const govtParameters: GovernmentParameterProps = state.networkDependent.govtParameters as GovernmentParameterProps;
  return { parameters, govtParameters };
};

export default connect(mapToStateToProps)(Parameterizer);
