import React, { useEffect } from 'react';
import { Grid, Segment } from 'semantic-ui-react';
import LoadingPage from './misc/LoadingPage';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import Symptom from 'classes/Symptom.class';
import SymptomPickerBox from './SymptomPickerBox';

export interface SymptomPickerProps {}

const SymptomPicker: React.SFC<SymptomPickerProps> = () => {
  let symptoms = useSelector((state: ReduxState) => state.symptoms.symptoms);
  const selectedIds = useSelector((state: ReduxState) => state.symptoms.selectedIds);
  const selected = symptoms.filter((s) => selectedIds.includes(s.id));
  symptoms = symptoms.filter((s) => !selectedIds.includes(s.id));

  useEffect(() => {
    Symptom.fetch();
  }, []);

  if (!symptoms) return <LoadingPage />;
  return (
    <Grid stackable columns="equal" divided>
      <Grid.Column>
        <Segment>
          <p>Alle symptomer</p>
          <SymptomPickerBox symptoms={symptoms} />
        </Segment>
      </Grid.Column>
      <Grid.Column>
        <Segment>
          <p>Valgt</p>
          <SymptomPickerBox symptoms={selected} />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default SymptomPicker;
