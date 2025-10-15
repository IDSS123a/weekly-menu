import React, { useMemo, useRef } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { Button, Typography, Grid, Paper } from '@material-ui/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

function MenuDisplay() {
  const { institution } = useParams();
  const location = useLocation();
  const history = useHistory();
  const containerRef = useRef(null);
  const menuData = location.state?.menuData || null;

  const displayName = useMemo(
    () => (menuData?.institution || institution || '').toUpperCase(),
    [institution, menuData]
  );

  const generatedLabel = useMemo(() => {
    if (!menuData?.generatedAt) {
      return 'Not available';
    }
    const generatedDate = new Date(menuData.generatedAt);
    if (Number.isNaN(generatedDate.getTime())) {
      return menuData.generatedAt;
    }
    return generatedDate.toLocaleString();
  }, [menuData]);

  const weekOfLabel = useMemo(() => {
    if (!menuData?.weekOf) {
      return '';
    }
    const weekDate = new Date(menuData.weekOf);
    if (Number.isNaN(weekDate.getTime())) {
      return menuData.weekOf;
    }
    return weekDate.toLocaleDateString();
  }, [menuData]);

  const menuDays = useMemo(() => {
    if (!menuData?.days) {
      return [];
    }
    return Array.isArray(menuData.days) ? menuData.days : [];
  }, [menuData]);

  const notes = useMemo(() => {
    if (!menuData?.notes) {
      return [];
    }
    return Array.isArray(menuData.notes) ? menuData.notes : [];
  }, [menuData]);

  const handleExport = async () => {
    if (!containerRef.current) {
      window.alert('Nothing to export yet!');
      return;
    }

    const canvas = await html2canvas(containerRef.current, { scale: 2 });
    const imageData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imageData, 'PNG', 0, 0, pageWidth, imgHeight);
    pdf.save(`weekly-menu-${institution}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    history.push(`/upload/${institution}`);
  };

  if (!menuData) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          No menu data available for {displayName}.
        </Typography>
        <Typography variant="body1" paragraph>
          Please upload a DOCX or PDF document to generate the weekly menu.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleBack}>
          Go to Upload
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Weekly Menu for {displayName}
      </Typography>
      {weekOfLabel ? (
        <Typography variant="subtitle1" gutterBottom>
          Week of: {weekOfLabel}
        </Typography>
      ) : null}
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Source file: {menuData.sourceFileName || 'Unknown'} — Generated: {generatedLabel}
      </Typography>
      <div className="menu-container" ref={containerRef}>
        <Grid container spacing={2}>
          {menuDays.map((day, dayIndex) => (
            <Grid item xs={12} sm={6} key={day.day || dayIndex}>
              <Paper style={{ padding: '16px', textAlign: 'left', height: '100%' }} elevation={2}>
                <Typography variant="h6" gutterBottom>
                  {day.day}
                </Typography>
                {Array.isArray(day.meals) && day.meals.length > 0 ? (
                  day.meals.map((meal, index) => {
                    const mealTitle = meal?.time
                      ? `${meal.time} — ${meal.name || 'Meal'}`
                      : meal?.name || meal?.time || 'Meal';
                    return (
                      <div key={`${day.day || 'day'}-${index}`} style={{ marginBottom: '12px' }}>
                        <Typography variant="subtitle1">{mealTitle}</Typography>
                        {meal?.description ? (
                          <Typography variant="body2" color="textSecondary">
                            {meal.description}
                          </Typography>
                        ) : null}
                      </div>
                    );
                  })
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No meals captured for this day.
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
        {notes.length ? (
          <div style={{ marginTop: '20px', textAlign: 'left' }}>
            <Typography variant="h6">Notes</Typography>
            {notes.map((note, index) => {
              const noteText = typeof note === 'string' ? note : JSON.stringify(note);
              return (
                <Typography key={`note-${index}`} variant="body2">
                  • {noteText}
                </Typography>
              );
            })}
          </div>
        ) : null}
      </div>
      <div style={{ marginTop: '20px' }}>
        <Button variant="contained" color="primary" onClick={handleExport} style={{ marginRight: '10px' }}>
          Export PDF
        </Button>
        <Button variant="contained" color="primary" onClick={handlePrint} style={{ marginRight: '10px' }}>
          Print
        </Button>
        <Button variant="outlined" color="primary" onClick={handleBack}>
          Back to Upload
        </Button>
      </div>
    </div>
  );
}

export default MenuDisplay;
