import React, { Component } from 'react';
import { Label, Icon } from 'semantic-ui-react';
import Logger from '../../js/Logger'
// import Downloader from '../../js/Downloader'
// import CsvConverter from '../../js/CsvConverter'
import CsvDownloadButton from '../../components/part/CsvDownloadButton'

class RecordDownloader extends Component {

  constructor(props) {
    super(props);
    this.logger = new Logger({prefix: this.constructor.name});
  }

  render() {

    let {
      data,
      fileName,
      onClick,
    } = this.props;

    return (
      <div>
        <Label size='large'>
          <Icon name='database' />
          {data.length} Records
        </Label>
        <CsvDownloadButton
          primary
          size='tiny'
          data={data}
          fileName={fileName + '.csv'}
          onClick={onClick}
        />
      </div>
    );
  }
}

export default RecordDownloader;
