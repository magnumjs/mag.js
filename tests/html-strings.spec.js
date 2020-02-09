import mag from "../src/main"



test("tagged template literal", ()=>{


    const App = mag(`<h1> <count/></h1>`, props=>{

        const {count=0} = props

        return {
            count,
            onclick:
                e => App({
                    ...props, count: count + 1
                })
        }
    })

    mag(
        mag.dom`
            <b>HI
            ${App({key:1})}
            ${App({key:2})}
            </b>
        `,
        document.body
    )

    expect(document.body.querySelector("count").textContent).toEqual("0")

    document.querySelector("h1").click()

    expect(document.body.querySelector("count").textContent).toEqual("1")
})