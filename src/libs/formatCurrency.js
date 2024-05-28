const formatCurrency = amount => {
    return amount?.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}

export default formatCurrency