import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import SquareRoundedIcon from '@mui/icons-material/SquareRounded';
import {
  Grid,
  Typography,
  useTheme
} from '@mui/material';

function ContestDetailSecurityDialogChart({ pieChartData }) {
  const theme = useTheme();
  const font = "'Nunito', sans-serif";
  let outputData = [];
  for(var i = 0; i < pieChartData.length; i++) {
       var input = pieChartData[i];
       outputData.push([input.symbol, input.percent]);
   }
  
  let text_color = theme.palette.primary.main;
  
  const pieChartColor = ['#FF6060', '#458FFF', '#7DEC8F', '#FD3AA3', '#34D2B8', '#613BFB', '#FF6060', '#458FFF', '#7DEC8F', '#FD3AA3', '#34D2B8', '#613BFB', '#FF6060', '#458FFF', '#7DEC8F', '#FD3AA3', '#34D2B8', '#613BFB'];
  const options = {
    tooltip: {
      formatter: function () {
          return + this.y + '%</b>';
      }
    },
    chart: {
      type: "pie",
      backgroundColor: 'rgba(0,0,0,0)',
      style: {
        fontFamily: font,
        color: '#316BFF',
      }
    },
    colors: ['#FF6060', '#458FFF', '#7DEC8F', '#FD3AA3', '#34D2B8', '#613BFB', '#FF6060', '#458FFF', '#7DEC8F', '#FD3AA3', '#34D2B8', '#613BFB', '#FF6060', '#458FFF', '#7DEC8F', '#FD3AA3', '#34D2B8', '#613BFB'],
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                color: text_color
            }
        }
    },
    title: {
      text: ''
    },
    credits:{
      enabled:false
    },
    series: [{
      data:outputData
    }]
  };

  return (
    <>
      <Grid item md={12} >
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </Grid>
      
      <Grid item md={12}>
        {pieChartData.map((piechart, index) => {
          return (
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="flex-start"
              sx={{mt:3}}
              piechart={piechart} key={index}
            >
              {piechart.is_short === null ? (
                <Grid
                  container
                  direction="row"
                  justifyContent="space-evenly"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid item xs={1}><SquareRoundedIcon sx={{color: pieChartColor[index]}} /></Grid>
                  <Grid item xs={11}><Typography variant="h1" component="div" color="primary" sx={{ fontWeight: 400, fontSize: 17, py:1}}>{piechart.security_name} ({piechart.percent}%)</Typography></Grid>
                </Grid>
              ) : (
                <>
                  {piechart.is_short ? (
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-evenly"
                      alignItems="center"
                      spacing={2}
                    >
                      <Grid item xs={1}><SquareRoundedIcon sx={{color: pieChartColor[index]}} /></Grid>
                      <Grid item xs={9}><Typography variant="h1" component="div" sx={{ fontWeight: 400, fontSize: 17, py:1, color:'#A95151' }}>{piechart.security_name} ({piechart.symbol} {piechart.percent}%)</Typography></Grid>
                      {piechart.percent_change >= 0 && (
                        <Grid item xs={2}><Typography variant="h1" component="div" sx={{ fontWeight: 200, fontSize: 12, py:1, color:'#00DE81' }}>{piechart.percent_change}%</Typography></Grid>
                      )}
                      {piechart.percent_change < 0 && (
                        <Grid item xs={2}><Typography variant="h1" component="div" sx={{ fontWeight: 200, fontSize: 12, py:1, color:'#A95151' }}>{piechart.percent_change}%</Typography></Grid>
                      )}
                    </Grid>
                  ) : (
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-evenly"
                      alignItems="center"
                      spacing={2}
                    >
                      <Grid item xs={1}><SquareRoundedIcon sx={{color: pieChartColor[index]}} /></Grid>
                      <Grid item xs={9}><Typography variant="h1" component="div" sx={{ fontWeight: 400, fontSize: 17, py:1,  color:'#00DE81' }}>{piechart.security_name} ({piechart.symbol} {piechart.percent}%)</Typography></Grid>
                      {piechart.percent_change >= 0 && (
                        <Grid item xs={2}><Typography variant="h1" component="div" sx={{ fontWeight: 200, fontSize: 12, py:1, color:'#00DE81' }}>{piechart.percent_change}%</Typography></Grid>
                      )}
                      {piechart.percent_change < 0 && (
                        <Grid item xs={2}><Typography variant="h1" component="div" sx={{ fontWeight: 200, fontSize: 12, py:1, color:'#A95151' }}>{piechart.percent_change}%</Typography></Grid>
                      )}
                    </Grid>
                  )}
                </>
              )}
            </Grid>    
            );
          })}
      </Grid>
    </>
  )
}

export default ContestDetailSecurityDialogChart;
