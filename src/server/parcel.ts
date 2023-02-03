import Parcel from 'parcel'

console.log(Parcel)

const file = 'src/client/index.pug'
const options = {}

export const parcel = new Parcel(file, options)
