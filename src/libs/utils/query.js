import { curry, isString, isFunction, flip, property, flow } from 'lodash-es'

/**
 * term definition
 *
 * + extractor: A function takes array item return a value. (item:any)=>any
 * + predict: A function takes two arguments return a boolean. (l:any,r:any)=>boolean
 * + left value: A value of predict's first argument
 * + right value: A value of predict's second argument
 * + condition: A curried function takes two arguments return filterFn. (extractor,value:any)=>filterFn
 * + condition creator: A high order function which will used to create condition from predict. (predict)=> condition
 * + filter function: A function used to filter data which takes array item return a boolean. (ele)=>boolean
 *
 *
 *
 */

export const query = curry((filterFn, data) => {
  if (!data || !data.filter) {
    // eslint-disable-next-line
    console.warn(`Filter on non-array`)
    return []
  }
  return data.filter(filterFn)
})

function makeSureItIsAExtractor (extractor) {
  if (isString(extractor)) {
    return property(extractor)
  } else if (isFunction(extractor)) {
    return extractor
  }
  throw new Error(`Unsupported extractor ${extractor}`)
}
export const chainExtractor =
  (...exts) =>
    (first) =>
      flow(makeSureItIsAExtractor(first), ...exts)
// Make condition base on extractor and exits condition
export const applyExtractor = curry((extractor, condition, ex, value) =>
  condition(chainExtractor(extractor)(ex), value),
)
// extractor : obj => obj (from elemen extract property)
export const condCreator = (predict) =>
  curry((extractor, value) => {
    let ext = makeSureItIsAExtractor(extractor)

    // return a filter function
    return (ele) => predict(ext(ele), value)
  })

const invoker = curry((callOnRight, method) => {
  let cond = (l, r) => l && l[method] && l[method](r)
  return callOnRight ? condCreator(flip(cond)) : condCreator(cond)
})
export const callOnLeftValue = invoker(false)
export const callOnRightValue = invoker(true)

// (filterFns)=> filterFn
export const and =
  (...filterFns) =>
    (ele) =>
      filterFns.every((filterFn) => filterFn(ele))
// (filterFns) => filterFn
export const or =
  (...filterFns) =>
    (ele) =>
      filterFns.some((filterFn) => filterFn(ele))
export const not = (filterFn) => (ele) => !filterFn(ele)

// for comparable
export const eq = condCreator((l, r) => l === r)
export const gt = condCreator((l, r) => l > r)
export const lt = condCreator((l, r) => l < r)
export const gte = condCreator((l, r) => l >= r)
export const lte = condCreator((l, r) => l <= r)

// for number
const applyToNumber = applyExtractor((a) => +a)
export const nEq = applyToNumber(eq)
export const nGt = applyToNumber(gt)
export const nLt = applyToNumber(lt)
export const nGte = applyToNumber(gte)
export const nLte = applyToNumber(lte)

// for array & string
export const includes = callOnLeftValue('includes')
// includedIn(a,b) means b.includes(a)
export const includedIn = callOnRightValue('includes')
export const match = callOnRightValue('test')

// for string
/**
 * startsWith means l starts with r
 */
export const startsWith = callOnLeftValue('startsWith')
/**
 * startsWithL means r starts with l
 */
export const isStartingOf = callOnRightValue('startsWith')
export const endsWith = callOnLeftValue('endsWith')
export const isEndingOf = callOnRightValue('endsWith')

export const inRange = condCreator((l, r) => {
  let [start, end] = r
  return l <= end && l >= start
})
// Example
/* eslint-disable */
/*

const data = [
  {
    arr:[2,4,5,6,7],
    id:1,
    ip:'127.0.0.1'
  },
  {
    arr:[1,2,3,4],
    ip:'192.168.0.1',
    id:2
  },
  {
    arr:[1,3,5,7,9],
    ip:'127.1',
    id:3
  }
]
const arrHasOne = includes("arr",1)
const idInRange = includedIn("id",[1,2])
const isLoopBack = match("ip",/^127(\.0)*\.1/)
console.log("1.those who have 1 in arr",query(arrHasOne,data))
console.log("2.those who id in [1,2]",query(idInRange,data))
console.log("3.local ip:",query(
  isLoopBack ,
  data)
)


const data2=[{
  age:"10",
},{
  age:"13"
},{
  age:"15",
},{
  age:"17"
}]


const ageLt = nLt("age")
const ageGt = nGt("age")

//query(e=> +e.age < 11,data2)
console.log("age>11",query(ageGt(11),data2))

console.log("age<15",query(ageLt(15),data2))

// query(e=> +e.age<15 && +e.age>10, data2)
console.log("10<age<15",query(
  and(
   ageLt(15),
   ageGt(10)
  ),
  data2))



query(or(
    eq(property("A"), 1),
    eq("B", 2),
    e => e.A === 2
  ), [
      { A: 1 },
      { A: 2 },
      { A: 3 },
      { B: 2 }
    ]
 )

 // Define a query
 const someQuery = query(and(
   gt("age",18),
   eq("sex",'male')
 ))
// then feed data to it , get the filtered data
const data3= [{age:18,name:"Jun",sex:'male'},{age:29,name:"Xinyi",sex:'male'},
 {
   age:19,
   name:'Jiajia',
   sex:'female'
 }]
 console.log(

someQuery(data3)
 )

const data4 = [{age:88,name:"Luyc"},{age:"77",name:"Fengyin"}]
console.log(

  someQuery(data4)
)


*/
