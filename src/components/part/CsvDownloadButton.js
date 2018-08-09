import React, { Component } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import Logger from '../../js/Logger'
import Downloader from '../../js/Downloader'
import CsvConverter from '../../js/CsvConverter'

class CsvDownloadButton extends Component {

  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
    this.onClick = this.onClick.bind(this);
    this.state = {
      progress: false,
    };
  }

  onClick(data, fileName, callback) {
    // this.logger.log("onClick", data, fileName, callback);
    this.setState({progress: true});
    let csvConverter = new CsvConverter();
    csvConverter.stringify(data, {header: true}).then(string => {
      // this.logger.log(string);
      let downloader = new Downloader();
      downloader.download(string, fileName);
      if (callback) {
        callback(data, fileName, callback);
      }
      this.setState({progress: false});
    });
  }

  render() {

    let {
      data,
      fileName,
      onClick,
      ...rest,
    } = this.props;

    return (
      <Button
        as='a'
        icon
        labelPosition='left'
        disabled={data.length <= 0}
        loading={this.state.progress}
        onClick={() => this.onClick(data, fileName, onClick)}
        {...rest}
      >
        <Icon name='file' />
        CSV Download
      </Button>
    );
  }
}

export default CsvDownloadButton;
