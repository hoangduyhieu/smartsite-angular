export class ChartInfo {
    static optionsChartNhietDo: any = {
        tooltips: {
            callbacks: {
                label(tooltipItem, data) {
                    const allData = data.datasets[tooltipItem.datasetIndex].data;
                    const tooltipLabel = data.labels[tooltipItem.index];
                    const tooltipData = allData[tooltipItem.index];
                    return tooltipLabel + ': ' + tooltipData + ' °C';
                }
            }
        },
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                usePointStyle: false
            },
        },
        title: {
            display: true,
            text: 'bctttram_chartnhietdo',
            fontSize: 15,
            fontStyle: 'bold'
        }
    };

    static optionsChartDoAm: any = {
        tooltips: {
            callbacks: {
                label(tooltipItem, data) {
                    const allData1 = data.datasets[tooltipItem.datasetIndex].data;
                    const tooltipLabel1 = data.labels[tooltipItem.index];
                    const tooltipData1 = allData1[tooltipItem.index];
                    return tooltipLabel1 + ': ' + tooltipData1 + ' %';
                }
            }
        },
        legend: {
            display: true,
            position: 'bottom'
        },
        title: {
            display: true,
            text: 'bctttram_chartdoam',
            fontSize: 15,
            fontStyle: 'bold'
        }
    };

    static optionsChartMucNuoc: any = {
        tooltips: {
            callbacks: {
                label(tooltipItem, data) {
                    const allData2 = data.datasets[tooltipItem.datasetIndex].data;
                    const tooltipLabel2 = data.labels[tooltipItem.index];
                    const tooltipData2 = allData2[tooltipItem.index];
                    return tooltipLabel2 + ': ' + tooltipData2 + ' Cm';
                }
            }
        },
        legend: {
            display: true,
            position: 'bottom'
        },
        title: {
            display: true,
            text: 'bctttram_chartmucnuoc',
            fontSize: 15,
            fontStyle: 'bold'
        }
    };

    static optionsChartDiaChan: any = {
        tooltips: {
            callbacks: {
                label(tooltipItem, data) {
                    const allData3 = data.datasets[tooltipItem.datasetIndex].data;
                    const tooltipLabel3 = data.labels[tooltipItem.index];
                    const tooltipData3 = allData3[tooltipItem.index];
                    return tooltipLabel3 + ': ' + tooltipData3 + ' mm';
                }
            }
        },
        legend: {
            display: true,
            position: 'bottom'
        },
        title: {
            display: true,
            text: 'bctttram_chartdiachan',
            fontSize: 15,
            fontStyle: 'bold'
        }
    };

    static optionsChartMoMit: any = {
        tooltips: {
            callbacks: {
                label(tooltipItem, data) {
                    const allData4 = data.datasets[tooltipItem.datasetIndex].data;
                    const tooltipLabel4 = data.labels[tooltipItem.index];
                    const tooltipData4 = allData4[tooltipItem.index];
                    return tooltipLabel4 + ': ' + tooltipData4 + ' obsc';
                }
            }
        },
        legend: {
            display: true,
            position: 'bottom'
        },
        title: {
            display: true,
            text: 'bctttram_chartmomit',
            fontSize: 15,
            fontStyle: 'bold'
        }
    };
}
