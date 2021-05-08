import React from 'react';
import {
  Table, Button, Input, Label,
} from 'semantic-ui-react';

const util = require('util');
const exec = util.promisify(require('child_process').exec);

const LocalChart = (props) => {
  const { chart, handleOpenChartClick } = props;

  // install helm chart. providing k8s secrets not yet attempted
  let chartInstName = ''; // chart name to install. default value is
  const installHelmChart = async () => {
    // const helmChart = props.chart.name;
    console.log('chartInstName:', chartInstName);
    const helmChart = sanitizeInput(chartInstName);
    console.log('helmChart:', helmChart);
    const directory = props.dirPath;
    console.log(`installing helm chart ${helmChart} at ${directory}`);
    const { stdout, stderr } = await exec(`helm install ${helmChart} ${directory}`);
    props.getDeployedCharts();
  };

  function setName(e) {
    // console.log(e.target.value);
    chartInstName = e.target.value;
  }

  function sanitizeInput(text) {
  // if field is empty, set props.chart.name
    const name = text.trim();
    if (text === '') {
      return props.chart.name;
    }
    const regex = /^\w+$/;
    if (regex.test(name)) {
      return name;
    }
    console.log('invalid input');
    Label.value = 'invalid input';
  }

  // Prepare the Open Chart button
  const openChartButton = <Button icon="folder open" size="tiny" compact onClick={() => handleOpenChartClick(chart.name)} />;

  // Prepare the Install button
  let installButton;
  const disabled = false;
  if (disabled) {
    installButton = <Button disabled size="tiny" compact onClick={() => installHelmChart()}>Install</Button>;
  } else {
    installButton = <Button size="tiny" compact onClick={() => installHelmChart()}>Install</Button>;
  }

  // build the local chart component
  return (
    <Table.Row>
      <Table.Cell>{chart.name}</Table.Cell>
      <Table.Cell>
        <Input
          focus
          placeholder={chart.name}
          onChange={setName}
        />
        <Label pointing="left">Please enter the name</Label>
      </Table.Cell>
      <Table.Cell>
        <div className="float-right">
          {installButton}
          {' '}
          {openChartButton}
        </div>
      </Table.Cell>
    </Table.Row>
  );
};

export default LocalChart;
