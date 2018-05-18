import * as React from "react";
import { Set } from "immutable";
import { Link } from "react-router-dom";

export interface ProposalsListOwnProps {
  proposals: Set<any>;
}

export class ProposalsList extends React.Component<ProposalsListOwnProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <StyledUl>
        {this.props.proposals.map(p => {
          return (
            <li key={p.id}>
              <ProposalListItem proposal={p!} />
            </li>
          );
        })}
      </StyledUl>
    );
  }
}

export interface ProposalListItemOwnProps {
  proposal: any;
}

class ProposalListItem extends React.Component<ProposalListItemOwnProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    const link = "/listing/" + this.props.proposal.id;
    return (
      <Link to={link}>
        {this.props.proposal.paramName!} - {this.props.proposal.propValue}
      </Link>
    );
  }
}
