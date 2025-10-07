import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ChartHelper from './ChartHelper';
import { Paper, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import '../index.css';

export default function Patients({ profile }) {
  const [patients, setPatients] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      let query = supabase.from('patient').select('*');

      if (profile.role === 'Department Head') {
        // Optional: filter by department
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching patients:', error);
      } else if (data) {
        setPatients(data);
        if (data.length > 0) setColumns(Object.keys(data[0]));
      }
    };

    fetchPatients();
  }, [profile]);

  // Chart: patient counts by age
  const ageCounts = {};
  patients.forEach(p => {
    const age = p.age || 'Unknown';
    ageCounts[age] = (ageCounts[age] || 0) + 1;
  });

  const chartData = [
    {
      x: Object.keys(ageCounts),
      y: Object.values(ageCounts),
      name: 'Patients by Age',
    },
  ];

  return (
    <Paper className="section-paper">
      <h3 className="section-title">Patients</h3>

      <div className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell key={col}>{col}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((row, idx) => (
              <TableRow key={idx}>
                {columns.map(col => (
                  <TableCell key={col}>{row[col]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <h3 className="section-title">Patient Age Distribution</h3>
      <ChartHelper dataArray={chartData} title="Patients by Age" yAxisTitle="Number of Patients" />
    </Paper>
  );
}
