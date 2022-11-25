import { io } from "socket.io-client";
// let url="http://localhost:3001"
let url="https://wovvmapsitapi.wovvtech.com"
let socket = io(url);

function select(sel) {
    return document.querySelector(sel)
}
// document.querySelector(".ID").addEventListener("change", (e) => {
//     console.log(e.target.value);
//     socket.on(`endpointrecive${e.target.value}`, (data) => {
//         select(".selectdata").innerHTML = data.name
//         console.log(data, "data is comming ");
//     })
// })

var selectData;
document.querySelector(".ID").addEventListener("change", async (e) => {
    let fecthRawFile = await fetch(`${url}/user/${e.target.value}`)
    let data = await fecthRawFile.json()
    console.log(data);
    if(data.error!==true){
        let nodePoint = data.user.filterNodePoint
        selectData = nodePoint.filter(d => {
            if (d.shape && d.LocationName?.text.trim().length > 0) {
                return d
            }
        })
    }else{
        alert("ID is expired")
    }
})
document.querySelector(".automatic").addEventListener("click", () => {
    console.log(selectData);
    let init1 = 0
    let init2 = 0
    let animate;
    document.querySelector(".export").style.display = "block"
    var ID = document.querySelector(".ID").value
    var elevator = document.querySelector("#elevator").value
    var escalator = document.querySelector("#escalator").value
    var stair = document.querySelector("#stair").value
    let pointType = { elevator: elevator === "true" ? true : false, escalator: escalator === "true" ? true : false, stair: stair === "true" ? true : false }
    function StartLoop() {
        let To = selectData[init1];
        const From = selectData[init2];
        let raw = {
            start: { x: +To.x, y: +To.y, z: +To.z },
            end: { x: +From.x, y: +From.y, z: +From.z },
            stape: pointType,
        };

        socket.emit(`findpath`, { raw, id: ID });
        if (init2 == selectData.length - 1) {
            init1++
            init2 = 0
        } else {
            init2++
        }
        if (init1 == selectData.length - 1) {
            alert("finied")
            clearInterval(id)
        }
        console.log(init1, "one");

    }
    var id = setInterval(StartLoop, 200)
    socket.on(`findpath${ID}`, (data) => {
        if (data.path.length > 1) {
            // let p = document.createElement("P")
            // p.style.backgroundColor="Green"
            // p.innerHTML = `${To.LocationName.text} To ${From.LocationName.text} is Pass`
            // document.querySelector(".automaticList").appendChild(p)
        } else {
            console.log(data.path.length, "1 se bada ", data.start, data.end)
            let { x, y, z } = data.start

            if (x !== data.end.x && y !== data.end.y && z !== data.end.z) {
                let p = document.createElement("P")
                let i = document.createElement("i")
                // p.style.color = "red"
                p.innerHTML = `${data.start.point.LocationName.text} <b class="b">To</b> ${data.end.point.LocationName.text} is <b class="fail">Fail</b>`
                i.innerHTML = `${x},${y},${z} To ${data.end.x},${data.end.y},${data.end.z} is Fail`

                document.querySelector(".automaticList").appendChild(p)
                // document.querySelector(".automaticList").appendChild(i)
            }
        }
    });
})
// document.querySelector(".automatic").addEventListener("click", () => {
//     console.log(selectData);
//     for (let index = 0; index < selectData.length; index++) {
//         let To = selectData[index];
//         var ID = document.querySelector(".ID").value
//         var elevator = document.querySelector("#elevator").value
//         var escalator = document.querySelector("#escalator").value
//         var stair = document.querySelector("#stair").value
//         let pointType = { elevator: elevator === "true" ? true : false, escalator: escalator === "true" ? true : false, stair: stair === "true" ? true : false }
//         for (let index1 = 0; index1 < selectData.length; index1++) {
//             const From = selectData[index1];
//             let raw = {
//                 start: { x: +To.x, y: +To.y, z: +To.z },
//                 end: { x: +From.x, y: +From.y, z: +From.z },
//                 stape: pointType,
//             };
//             if (To.x !== From.x && To.y !== From.y && To.z !== From.z) {

//                 socket.emit(`findpath`, { raw, id: ID });
//                 socket.on(`findpath${ID}`, (data) => {
//                     if (data.path.length > 1) {
//                         let p = document.createElement("P")
//                         p.innerHTML = `${To.LocationName.text} To ${From.LocationName.text} is Pass`
//                         document.querySelector(".automaticList").appendChild(p)
//                     } else {
//                         let p = document.createElement("P")
//                         p.innerHTML = `${To.LocationName.text} To ${From.LocationName.text} is Pass`
//                         document.querySelector(".automaticList").appendChild(p)
//                     }
//                 });
//             }

//         }

//     }
// })