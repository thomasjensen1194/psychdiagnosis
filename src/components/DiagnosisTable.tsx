import React, { useEffect } from 'react';
import { Table } from 'semantic-ui-react';
import DiagnosisTableRow from './DiagnosisTableRow';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import LoadingPage from './misc/LoadingPage';
import Diagnosis from 'classes/Diagnosis.class';
import DiagnosisInputRow from './DiagnosisInputRow';
import { totalSymptoms } from 'utils/utils';

export interface DiagnosisTableProps {}

const DiagnosisTable: React.SFC<DiagnosisTableProps> = () => {
  const user = useSelector((state: ReduxState) => state.auth.user);
  const diagnoses = useSelector((state: ReduxState) => state.diagnoses.diagnoses);
  const symptomIds = useSelector((state: ReduxState) => state.symptoms.selectedIds);

  const sorter = (a: Diagnosis, b: Diagnosis) => {
    const percentage = (d: Diagnosis) => {
      const selected = totalSymptoms(d).filter((s) => symptomIds.includes(s.id));
      if (selected.length === 0) return 0;

      return selected.length / totalSymptoms(d).length;
    };

    if (percentage(a) < percentage(b)) return 1;
    if (percentage(a) > percentage(b)) return -1;
    return a.icdCode.localeCompare(b.icdCode);
  };

  useEffect(() => {
    Diagnosis.fetch();
  }, []);

  if (!diagnoses) return <LoadingPage />;
  return (
    <Table celled size="small">
      <Table.Header>
        <Table.HeaderCell width={1}>Diagnose</Table.HeaderCell>
        <Table.HeaderCell width={1}>ICD-10 kode</Table.HeaderCell>
        <Table.HeaderCell width={4}>Beskrivelse</Table.HeaderCell>
        <Table.HeaderCell width={2}>Overdiagnose</Table.HeaderCell>
        <Table.HeaderCell>Symptomer</Table.HeaderCell>
        <Table.HeaderCell>Opfyldt</Table.HeaderCell>
        {user && <Table.HeaderCell>Muligheder</Table.HeaderCell>}
      </Table.Header>
      <Table.Body>
        {diagnoses
          .slice()
          .sort(sorter)
          .map((d) => <DiagnosisTableRow diagnosis={d} />)
          .concat(user && <DiagnosisInputRow />)}
      </Table.Body>
    </Table>
  );
};

export default DiagnosisTable;
