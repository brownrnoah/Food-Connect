import React from 'react';
import {Bar} from 'react-chartjs-2';
import * as utilFunc  from '../../../config/analyticsUtil';
import {connect} from 'react-redux';
import {getBusinessBasketsCompleted} from '../../../ducks/analyticsReducer'
import './StatChart.css'

export class StatChart extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            data: {
                datasets: [
                    {
                        data: [],
                        backgroundColor: utilFunc.generateRandomColors(this.props.numColors)
                    }
                ],
                labels:[]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    position: "top",
                    text: "Charitable Contributions",
                    fontSize: 25,
                    fontColor: "#000000"
                },
                legend: {display: false},
                scales : {
                    yAxes: [{
                        ticks: {
                            callback: function (value, index, values) {
                                return "$" + utilFunc.formatNumber(value, 2, 3, ',', '.');
                            },
                            beginAtZero: true
                        }
                    }]
                }
            }
        }
    }

    componentDidMount(){
        let labels=[]
        let data = []
        let dataCopy = Object.assign({}, this.state.data)
        
        for(var i=0; i < this.props.allItems.length ; i++){
            labels.push(this.props.allItems[i].item);
        }
        for(var i=0; i < this.props.allItems.length ; i++){
            data.push(~~this.props.allItems[i].FMV);
        }

        dataCopy.datasets[0].data = data;
        dataCopy.labels = labels;
        this.setState({data: dataCopy})
    }

    componentWillReceiveProps(nextProps){
        if(nextProps !== this.props){
            let labels=[]
            let data = []
            let dataCopy = Object.assign({}, this.state.data)
            
            for(var i=0; i < nextProps.allItems.length ; i++){
                labels.push(nextProps.allItems[i].item);
            }
            for(var i=0; i < nextProps.allItems.length ; i++){
                data.push(~~nextProps.allItems[i].FMV);
            }
    
            dataCopy.datasets[0].data = data;
            dataCopy.datasets[0].backgroundColor = utilFunc.generateRandomColors(nextProps.numColors);
            dataCopy.labels = labels;
            this.setState({data: dataCopy})
        }

    }


    render() {
        
        return (

            <div className='bar-chart-stat'>
                <Bar height={100} weight={100} data={this.state.data} options = {this.state.options}/>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        businessBaskets: state.analyticsReducer.businessBaskets
    }
}

export default connect(mapStateToProps, {getBusinessBasketsCompleted})(StatChart);