import {Line} from 'react-chartjs-2'
import {useState, useEffect} from 'react'
import {throttle} from 'lodash'

const Chart = (props) => {
    const [labels, setLabels] = useState([])
    const [data, setData] = useState([])
    const TIME_INTERVAL = 1000; //update chart every 1 sec
    const formatLabel = (time) => {
        const date = new Date(time)
        return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    }
    useEffect(() => {
        const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade')
        ws.onmessage = throttle((event) => {
            const dataObj = JSON.parse(event.data)
            setData(data => [...data, dataObj.p])

            setLabels(labels => [...labels, formatLabel(dataObj.E)])
        }, TIME_INTERVAL)
    }, [])

    const chartData = {
        labels: labels,
        datasets: [
          {
            label: 'BTC price',
            data: data,
            backgroundColor: 'blue',
          },
        ],
      };
    const options = {
    animation: {duration:0},
    scales: {
        yAxes: [
        {
            ticks: {
            beginAtZero: true,
            },
        },
        ],
    },
    // xAxes:{type:'time'}
    };

    return <Line data={chartData} options={options} />;
}

export default Chart
