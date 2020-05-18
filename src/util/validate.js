var Web3Utils = require('web3-utils');

export function validate(type, value) {
    
    switch (type) {
        case 'address':
            let result = { is: Web3Utils.isAddress(value), msg: Web3Utils.isAddress(value) ? '' :'Invalid input: Unexpected end of address input ' };
            return result
            break;
    
        default:
            break;
    }
}
