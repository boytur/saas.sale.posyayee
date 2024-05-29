/* eslint-disable react/prop-types */
import formatTime from '../../libs/formatTime'
import formatUTCtoThai from '../../libs/formatUTCtoThai'
import Chart from 'react-apexcharts'

function Charts ({ cashFlow }) {
  const convertToLocalTime = utcDate => {
    const localDate = formatUTCtoThai(utcDate)
    return localDate
  }

  const areDatesSameDay = dates => {
    const firstDate = convertToLocalTime(dates[0])
    return dates.every(date => {
      const currentDate = convertToLocalTime(date)
      return (
        currentDate.split(',')[0] === firstDate.split(',')[0] &&
        currentDate.split(',')[1] === firstDate.split(',')[1] &&
        currentDate.split(',')[2] === firstDate.split(',')[2]
      )
    })
  }

  const getOptions = () => {
    if (!cashFlow.bills || cashFlow.bills.length === 0) return []

    const dates = cashFlow.bills.map(bill => bill.createdAt)

    // If the bill is same day
    if (areDatesSameDay(dates)) {
      return cashFlow.bills.map(bill => formatTime(bill.createdAt))
    } else {
      const data = {}
      cashFlow?.bills.forEach(bill => {
        const date = formatUTCtoThai(bill.createdAt)
        if (!data[date]) {
          data[date] = {
            bill_all_amount: 0,
            bill_all_profit: 0,
            bill_all_discount: 0
          }
        }
        data[date].bill_all_amount += parseFloat(bill.bill_all_amount)
        data[date].bill_all_profit += parseFloat(bill.bill_all_profit)
        data[date].bill_all_discount += parseFloat(bill.bill_all_discount)
      })

      return Object.keys(data)
    }
  }

  const getData = choice => {
    if (!cashFlow.bills || cashFlow.bills.length === 0) return []
    const dates = cashFlow.bills.map(bill => bill.createdAt)

    if (areDatesSameDay(dates)) {
      if (choice === 'all') {
        return cashFlow?.bills?.map(bill => bill.bill_all_amount.toFixed(2))
      }
      if (choice === 'profit') {
        return cashFlow?.bills?.map(bill => bill.bill_all_profit.toFixed(2))
      }
      if (choice === 'discount') {
        return cashFlow?.bills?.map(bill => bill.bill_all_discount.toFixed(2))
      }
    } else {
      const data = {}
      cashFlow.bills.forEach(bill => {
        const date = formatUTCtoThai(bill.createdAt)
        if (!data[date]) {
          data[date] = {
            bill_all_amount: 0,
            bill_all_profit: 0,
            bill_all_discount: 0
          }
        }

        data[date].bill_all_amount += parseFloat(bill.bill_all_amount)
        data[date].bill_all_profit += parseFloat(bill.bill_all_profit)
        data[date].bill_all_discount += parseFloat(bill.bill_all_discount)
      })

      if (choice === 'all') {
        return Object.keys(data).map(date =>
          parseFloat(data[date].bill_all_amount.toFixed(2))
        )
      }
      if (choice === 'profit') {
        return Object.keys(data).map(date =>
          parseFloat(data[date].bill_all_profit.toFixed(2))
        )
      }
      if (choice === 'discount') {
        return Object.keys(data).map(date =>
          parseFloat(data[date].bill_all_discount.toFixed(2))
        )
      }
    }
  }

  const options = {
    xaxis: {
      categories: getOptions()
    }
  }

  const series = [
    {
      name: 'ยอดทั้งหมด',
      data: getData('all')
    },
    {
      name: 'กำไร',
      data: getData('profit')
    },
    {
      name: 'ส่วนลด',
      data: getData('discount'),
      color: '#F88379'
    }
  ]
  return (
    <div>
      <Chart
        options={options}
        series={series}
        height='400px'
        width='100%'
        type='area'
      />
    </div>
  )
}

export default Charts
