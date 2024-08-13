import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import {
  Scheduler,
  WeekView,
  MonthView,
  DayView,
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  Toolbar,
  DateNavigator,
  ViewSwitcher,
  AllDayPanel,
} from '@devexpress/dx-react-scheduler-material-ui';

import { ViewState, EditingState, IntegratedEditing } from '@devexpress/dx-react-scheduler';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, Timestamp  } from 'firebase/firestore';
import { db } from './firebase';

const CustomAppointment = ({ children, style, ...restProps }) => (
  <Appointments.Appointment
    {...restProps}
    style={{
      ...style,
      borderRadius: '12px',
      width: '100%', 
    }}
  >
    {children}
  </Appointments.Appointment>
);

function App() {
  const [data, setData] = useState([]);

  const fetchAppointments = async () => {
    const querySnapshot = await getDocs(collection(db, 'appointments'));
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            startDate: data.startDate.toDate(), 
            endDate: data.endDate.toDate(),     
        };
    });
  };

  const commitChanges = async ({ added, changed, deleted }) => {
    let updatedData = [...data];
    if (added) {
      added.startDate = Timestamp.fromDate(new Date(added.startDate));
      added.endDate = Timestamp.fromDate(new Date(added.endDate));
      const docRef = await addDoc(collection(db, 'appointments'), added);
      updatedData = [...data, { id: docRef.id, ...added }];
    }
    if (changed) {
      const appointmentId = Object.keys(changed)[0];
      const appointment = updatedData.find(item => item.id === appointmentId);
      changed[appointmentId].startDate = Timestamp.fromDate(new Date(changed[appointmentId].startDate));
      changed[appointmentId].endDate = Timestamp.fromDate(new Date(changed[appointmentId].endDate));
      await updateDoc(doc(db, 'appointments', appointmentId), changed[appointmentId]);
      updatedData = updatedData.map(item =>
        item.id === appointmentId ? { ...item, ...changed[appointmentId] } : item
      );
    }
    if (deleted !== undefined) {
      await deleteDoc(doc(db, 'appointments', deleted));
      updatedData = updatedData.filter(item => item.id !== deleted);
    }

    const appointments = await fetchAppointments();
    setData(appointments);
  };

  useEffect(() => {
    const loadAppointments = async () => {
      const appointments = await fetchAppointments();
      console.log('Pobrane wydarzenia:', appointments);
      setData(appointments);
    };
    loadAppointments();
  }, []);

  return (
    <Paper>
      <Scheduler data={data} locale="pl-PL">
        <ViewState defaultCurrentDate="2024-08-14" />
        <EditingState onCommitChanges={commitChanges} />
        <IntegratedEditing />
        <DayView startDayHour={0} endDayHour={24} />
        <WeekView startDayHour={0} endDayHour={24} />
        <MonthView />
        <Toolbar />
        <DateNavigator />
        <ViewSwitcher />
        <AllDayPanel />
        <Appointments appointmentComponent={CustomAppointment} />
        <AppointmentTooltip showOpenButton showDeleteButton />
        <AppointmentForm />
      </Scheduler>
    </Paper>
  );
}

export default App;
