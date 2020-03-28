import React, { useState } from 'react';
import { Table, Icon, Modal, Button } from 'semantic-ui-react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import Symptom from 'classes/Symptom.class';
import DiagnosisSymptomInput from './DiagnosisSymptomInput';
import Diagnosis from 'classes/Diagnosis.class';
import DiagnosisInputRow from './DiagnosisInputRow';
import DiagnosisParentInput from './DiagnosisParentInput';
import SymptomTag from './SymptomTag';
import { totalSymptoms } from 'utils/utils';
import Highlighter from 'react-highlighter';

const Break = styled.div`
  flex-basis: 100%;
  border-bottom: 1px solid lightgrey;
  height: 5px;
  padding: 5px;
`;

export const Tag = styled.span<{ active?: boolean; notParent?: boolean }>`
  border-radius: 5px;
  background-color: ${(props) => (props.active ? '#0089e0' : props.notParent ? '#ffdd8f' : null)};
  padding: 3px 10px;
  color: ${(props) => (props.active ? 'white' : null)};
  margin-left: 5px;
  margin-top: 5px;
  cursor: pointer;
  border: ${(props) => (props.active ? null : '1px dashed black')};

  :hover {
    border: 1px solid black;
  }
`;

export interface DiagnosisTableRowProps {
  diagnosis: Diagnosis;
  search: String;
}

const DiagnosisTableRow: React.SFC<DiagnosisTableRowProps> = ({ diagnosis, search }) => {
  const [adding, setAdding] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const user = useSelector((state: ReduxState) => state.auth.user);
  const allSymptoms = useSelector((state: ReduxState) => state.symptoms.symptoms);
  const symptomIds = useSelector((state: ReduxState) => state.symptoms.selectedIds);
  const diagnoses = useSelector((state: ReduxState) => state.diagnoses.diagnoses);
  const symptoms = totalSymptoms(diagnosis);
  const pickedSymptoms = symptoms.filter((s) => symptomIds.includes(s.id));
  const excessSymptoms = allSymptoms.filter(
    (symp) => !symptoms.map((s) => s.id).includes(symp.id) && symptomIds.includes(symp.id)
  );

  const sorter = (a: Symptom, b: Symptom) => {
    return a.name.localeCompare(b.name);
  };

  const handleRemove = async () => {
    setIsDeleting(true);
    await Diagnosis.remove(diagnosis.id);
    setDeleteModal(false);
    setIsDeleting(false);
  };

  const handleRemoveParent = async (parentId: number) => {
    await Diagnosis.removeParent(diagnosis.id, parentId);
  };

  const createExcess = () => {
    const excess = excessSymptoms.map((s) => (
      <SymptomTag
        diagnosis={diagnosis}
        symptom={s}
        style={{ backgroundColor: '#870000', color: 'white' }}
      />
    ));

    if (excess.length === 0)
      return <Icon style={{ marginLeft: '5px', alignSelf: 'center' }} name="check" color="green" />;
    return excess;
  };

  if (isEditing) return <DiagnosisInputRow diagnosis={diagnosis} setEditing={setEditing} />;
  return (
    <>
      <Table.Row>
        <Table.Cell>
          <Highlighter search={search}>{diagnosis.name}</Highlighter>
        </Table.Cell>
        <Table.Cell textAlign="center">
          <Highlighter search={search}>{diagnosis.icdCode}</Highlighter>
        </Table.Cell>
        <Table.Cell>
          <Highlighter search={search}>{diagnosis.description}</Highlighter>
        </Table.Cell>
        <Table.Cell>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {diagnosis.parents
              .map((p) => (
                <Tag>
                  {diagnoses.find((d) => d.id === p.id).name}
                  {user && (
                    <>
                      {' '}
                      <Icon onClick={() => handleRemoveParent(p.id)} name="close" color="grey" />
                    </>
                  )}
                </Tag>
              ))
              .concat(user && <DiagnosisParentInput diagnosis={diagnosis} />)}
          </div>
        </Table.Cell>
        <Table.Cell>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {symptoms
              .slice()
              .sort(sorter)
              .map((s) => <SymptomTag symptom={s} diagnosis={diagnosis} />)
              .concat(
                user &&
                  (adding ? (
                    <DiagnosisSymptomInput diagnosis={diagnosis} setAdding={setAdding} />
                  ) : (
                    <Tag onClick={() => setAdding(true)}>+ Tilføj symptom</Tag>
                  ))
              )
              .concat(
                <>
                  <Break />
                  <span style={{ alignSelf: 'center' }}>Ikke matchende symptomer: </span>
                  {createExcess()}
                </>
              )}
          </div>
        </Table.Cell>
        <Table.Cell>
          {pickedSymptoms.length} / {symptoms.length} (
          {((pickedSymptoms.length / symptoms.length) * 100).toFixed(0)} %)
        </Table.Cell>
        {user && (
          <Table.Cell>
            <Button.Group fluid>
              <Button onClick={() => setEditing(true)} basic color="orange">
                Rediger
              </Button>
              <Modal
                open={deleteModal}
                trigger={
                  <Button onClick={() => setDeleteModal(true)} basic color="red">
                    Slet
                  </Button>
                }
              >
                <Modal.Header>Vil du slette {diagnosis.name}?</Modal.Header>
                <Modal.Actions>
                  <Button basic color="black" onClick={() => setDeleteModal(false)}>
                    <Icon name="close" /> Nej
                  </Button>
                  <Button
                    loading={isDeleting}
                    disabled={isDeleting}
                    basic
                    color="red"
                    onClick={handleRemove}
                  >
                    <Icon name="trash" /> Ja
                  </Button>
                </Modal.Actions>
              </Modal>
            </Button.Group>
          </Table.Cell>
        )}
      </Table.Row>
    </>
  );
};

export default DiagnosisTableRow;
