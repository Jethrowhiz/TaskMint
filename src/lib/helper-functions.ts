import { BountyStatus } from "../types";

export const truncateValue = (valueToTruncate: any, decimals = 3) => {
  const truncated = Math.trunc(valueToTruncate * Math.pow(10, decimals)) / Math.pow(10, decimals);

  return truncated;
};

export const toDecimal = (SCValue: any) => {
  return SCValue / Math.pow(10, 6);
};

export function shortenAddress(address: string, chars = 4): string {
  try {
    return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`
  } catch (error) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
}

export function formatNumberScale(number: any, usd = false) {
  if (isNaN(number) || number === '' || number === undefined) {
    return usd ? '$0.00' : '0'
  }
  const num = parseFloat(number)
  const wholeNumberLength = String(Math.floor(num)).length

  if (wholeNumberLength >= 13) return (usd ? '$' : '') + (num / Math.pow(10, 12)).toFixed(1) + 'T'
  if (wholeNumberLength >= 10) return (usd ? '$' : '') + (num / Math.pow(10, 9)).toFixed(1) + 'B'
  if (wholeNumberLength >= 7) return (usd ? '$' : '') + (num / Math.pow(10, 6)).toFixed(1) + 'M'
  if (wholeNumberLength >= 4) return (usd ? '$' : '') + (num / Math.pow(10, 3)).toFixed(1) + 'K'

  if (num < 0.0001 && num > 0) {
    return usd ? '< $0.0001' : '< 0.0001'
  }

  return (usd ? '$' : '') + truncateValue(num, 2)
}

export const getStatusColor = (status: BountyStatus) => {
  switch (status) {
    case BountyStatus.Open:
      return 'bg-green-300 text-green-800';
    case BountyStatus.InProgress:
      return 'bg-yellow-300 text-yellow-800';
    case BountyStatus.Completed:
      return 'bg-blue-300 text-blue-800';
    case BountyStatus.Cancelled:
      return 'bg-red-300 text-red-800';
    default:
      return 'bg-gray-300 text-gray-800';
  }
};

export const getStatusText = (status: BountyStatus) => {
  switch (status) {
    case BountyStatus.Open:
      return 'Open';
    case BountyStatus.InProgress:
      return 'In Progress';
    case BountyStatus.Completed:
      return 'Completed';
    case BountyStatus.Cancelled:
      return 'Cancelled';
    default:
      return 'Unknown';
  }
};