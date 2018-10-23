import * as React from "react";
import { LoadingIndicator } from "./LoadingIndicator";
import { ModalHeading, ModalContent } from "./ModalContent";
import { Button, buttonSizes } from "./Button";

export interface ProgressModalContentProps {
  hideModal?(): () => void;
}

export class ProgressModalContentInProgress extends React.Component<ProgressModalContentProps> {
  public render(): JSX.Element {
    const content = this.props.children || <ModalHeading>Your transaction is in progress.</ModalHeading>;

    return (
      <>
        <LoadingIndicator height={100} width={150} />
        {content}
        <ModalContent>
          Your transaction is processing. This can take 1-3 minutes. Please don't close the tab.
        </ModalContent>
        <ModalContent>How about taking a little breather and standing for a bit? Maybe even stretching?</ModalContent>
      </>
    );
  }
}

export class ProgressModalContentSuccess extends React.Component<ProgressModalContentProps> {
  public render(): JSX.Element {
    return (
      <>
        <ModalHeading>Success!</ModalHeading>
        <ModalContent>Transaction processed.</ModalContent>
        <Button onClick={this.handleOnClick} size={buttonSizes.MEDIUM}>
          Ok!
        </Button>
      </>
    );
  }

  private handleOnClick = (event: any): void => {
    if (this.props.hideModal) {
      this.props.hideModal();
    }
  };
}

export class ProgressModalContentError extends React.Component<ProgressModalContentProps> {
  public render(): JSX.Element {
    if (this.props.children) {
      return (
        <>
          {this.props.children}
          <Button onClick={this.handleOnClick} size={buttonSizes.MEDIUM}>
            Dismiss
          </Button>
        </>
      );
    }

    return (
      <>
        <ModalHeading>Uh oh!</ModalHeading>
        <ModalContent>Your transaction failed. Please try again.</ModalContent>
        <Button onClick={this.handleOnClick} size={buttonSizes.MEDIUM}>
          Dismiss
        </Button>
      </>
    );
  }

  private handleOnClick = (event: any): void => {
    if (this.props.hideModal) {
      this.props.hideModal();
    }
  };
}
