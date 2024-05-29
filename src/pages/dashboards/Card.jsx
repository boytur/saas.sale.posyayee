/* eslint-disable react/prop-types */
import formatCurrency from '../../libs/formatCurrency'
import { FcCurrencyExchange } from 'react-icons/fc'
import { FcMoneyTransfer } from 'react-icons/fc'
import { FcSurvey } from 'react-icons/fc'
import { FcBullish } from 'react-icons/fc'
import { FcViewDetails } from 'react-icons/fc'
function Card ({ cashFlow }) {

  const cashFlowData = [
    {
      key: 'amount',
      data: `฿${formatCurrency(cashFlow?.all_cash_flows?.amount) || 'กำลังโหลด...'}`,
      style: 'border-b-blue-700 border-b-[5px] text-blue-900',
      icon: <FcCurrencyExchange size={50} />,
      title: 'ยอดขายทั้งหมด'
    },
    {
      key: 'cash',
      data: `฿${formatCurrency(cashFlow?.all_cash_flows?.cash) || 'กำลังโหลด...'}`,
      style: 'border-b-purple-900 border-b-[5px] text-purple-900',
      icon: <FcMoneyTransfer size={50} />,
      title: 'เงินสด'
    },
    {
      key: 'credit',
      data: `฿${formatCurrency(cashFlow?.all_cash_flows?.credit) || 'กำลังโหลด...'}`,
      style: 'border-b-gray-500 border-b-[5px] text-black',
      icon: <FcSurvey size={50} />,
      title: 'เครดิต'
    },
    {
      key: 'profit',
      data: `฿${formatCurrency(cashFlow?.all_cash_flows?.profit) || 'กำลังโหลด...'}`,
      style: 'border-b-green-700 border-b-[5px] text-green-600',
      icon: <FcBullish size={50} />,
      title: 'กำไร'
    },
    {
      key: 'bill',
      data: cashFlow?.total || 'กำลังโหลด...',
      style: 'border-b-orange-900 border-b-[5px]  text-orange-900',
      icon: <FcViewDetails size={50} />,
      title: 'บิลทั้งหมด'
    }
  ]

  return (
    <div className='w-full mt-2 mb-2 flex gap-2 flex-wrap px-2 md:px-0'>
      {cashFlowData?.map(cashFlow => (
        <div
          key={cashFlow.key}
          className={`md:w-[17rem] w-full h-[8rem] flex items-center border justify-center bg-white rounded-md shadow-sm ${cashFlow.style}`}
        >
          <div className='flex items-center justify-center'>
            <span className='text-lg mr-2'>{cashFlow.icon}</span>
            <div>
              <p className='font-bold text-[1.8rem]'>{cashFlow.data}</p>
              <p className='text-sm  text-black'>{cashFlow.title}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Card
