import React, { useEffect, useState } from 'react';
import 'Styles.scss';
import Cookies from 'components/Cookies'
import Counter from 'components/Counter'
import BarData from 'components/BarData'
import DounatData from 'components/DounatData'
import Check from 'assets/Check.png'
import Close from 'assets/Close.png'
import Trash from 'assets/Trash.png'
import Label from 'assets/Label.png'

let baseAPI = "https://api-nginx-lms.accelego.id/api/v1/hiring"

const Category = [
    {value: "Category 1",label: "Category 1"},
    {value: "Category 2",label: "Category 2"},
    {value: "Category 3",label: "Category 3"},
    {value: "Category 4",label: "Category 4"},
]

function Selector({active}){
    if(active) {
        return(
            <img src={Check} alt="Check" className='Selector' />
        )
    } else {
        return(
            <div  className='SelectorWrapper' />
        )
    }
}

function Radio({active,text,toogle}){
    return(
        <div className='RadioWrapper'>
            <div onClick={toogle} className='RadioOn'>
                {active &&  <div className='InRadio' /> }
            </div>
            <div className='RadioText'>
            {text}
            </div>
        </div>
    )
}

function ListData(props,headlink,link,toogle){
    let { data } = props
    let list =  data.map((item,index)=> {
    return(
        <tr key={index} className="ListTable">
            <td>
                <Selector active={true} />
            </td>
            <td className='TableRow'>{item.name}</td>
            <td className='TableRow'>{item.category}</td>
            <td className='TableRow'>{item.availability}</td>
            <td className='TableRow'>{item.arrival_status}</td>
        </tr>
        )
    })

    return(
        <table className='Table'>
        <tr className="ListTableHead">
            <td><Selector active={false} /></td>
            <td className='TableRowHead'>Name</td>
            <td className='TableRowHead'>Category</td>
            <td className='TableRowHead'>Availability</td>
            <td className='TableRowHead'>Arrival</td>
        </tr>
            {list}
        </table>
    )
}

function Home(){
    const [listData,setListData] = useState([])
    
    const [nameForm,setNameForm] = useState("")
    const [catForm,setCatForm] = useState("")
    const [availForm,setAvailForm] = useState(0)
    const [barlist,setBarlist] = useState([0,0,0,0])
    const [barLoad,setBarLoad] = useState(false)
    const [dounatList,setDounatList] = useState([0,0])
    const [dounatLoad,setDounatLoad] = useState(false)

    const [listCheck, setListCheck] = useState([])
    const [bulk,setBulk] = useState(false)

    const Checker = function(id) {
        let data = listData
        let newCheck = listCheck
        const foundId = newCheck.find(element => element === id)
        let longtes = newCheck.length + 1

        if(foundId) {
            data.length == newCheck.length && setBulk(false)
            const newList = newCheck.filter(v => v !== id)
            const indexData = data.findIndex(v => v._id == id)
            data[indexData].is_check = 0
            setListCheck(newList)
            setListData([...data])
        } else {
            newCheck.push(id)
            data.length == longtes && setBulk(true)
            const indexData = data.findIndex(v => v._id == id)
            data[indexData].is_check = 1
            setListCheck(newCheck)
            setListData([...data])
        } 
    }

    const BulkData = () => {
        let newData = listData
        let point = []
        
        newData.forEach((item,i)=>{
            if(item){newData[i].is_check = 1}
        })
        newData.forEach((item,i)=>{
            point.push(item._id)
        })

        
        setListCheck(point)
        setListData([...newData])
        setBulk(true)
        setListCheck(point)
    }
    const CancelBulk = () => {
        let newData = listData
        let point = []

        newData.forEach((item,i)=>{
            if(item){newData[i].is_check = 0}
        })

        setListData([...newData])
        setBulk(false)
        setListCheck(point)
    }

    const getDataLabel = async () => {
        let barData = barlist
        let dounatData = dounatList
        let long =  listData.length
        listData.map((item,index) => {
            if(item.category === "Category 1") {
                barData[0] = barData[0]+1
            }
            if(item.category === "Category 2") {
                barData[1] = barData[1]+1
            }
            if(item.category === "Category 3") {
                barData[2] = barData[2]+1
            }
            if(item.category === "Category 4") {
                barData[3] = barData[3]+1
            }
            setBarlist(barData)
            index == long-1 && setBarLoad(true) 
            })

        listData.map((item,index) => {
            if(item.availability === "Available") {
                dounatData[0] = dounatData[0]+1
            }
            if(item.availability === "Full") {
                dounatData[1] = dounatData[1]+1
            }
            setDounatList(dounatData)
            index == long-1 && setDounatLoad(true) 
            })
            
    }

    
    const DounatDataList = {
        labels: ['Available','Full'],
        datasets: [
        {
            label: '# of Votes',
            data: dounatList,
            backgroundColor: [
            '#295757',
            '#EF6D3F',
            ],
        },
        ],
    };
    
    const labels = ['1', '2', '3', '4',];   

    const BarDataList = {
        labels,
        datasets: [
        {
        label: 'Dataset 1',
        data: barlist ,
        backgroundColor:  "#EF6D3F",
        },
    ],
    }
    
    const SubmitForm = () => {
        console.log('form',nameForm ,catForm,availForm)
        let data = {name:nameForm,category:catForm, availability:availForm == 0 ? "Available" : "Full"}
        fetch(baseAPI,{method:'POST', headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },body:JSON.stringify(data)})
        .then((response) => response.json())
        .then((json)=> {
            console.log("component post mount",json)
            getData()
            getDataLabel()
            // setName(json.body)
            setNameForm("")
            setCatForm("")
            setAvailForm(0)
        });
    }
    
    const getData = () => {
        let mounted = true
        fetch(baseAPI)
        .then((response) => response.json())
        .then((json)=> {
            console.log("component did 2 mount",json)
            let type = json.value.hiringTest

            type.forEach((item,i)=>{
                if(item){type[i].is_check = 0}
            })

            setListData(type)
            // type && type.map((item,index)=>index == 1 && getDataLabel())
            // getDataLabel()
        });
        // return ()=>setMounted(false)
    }
    
    useEffect(()=>{
        getData()
    }, [])
    useEffect(()=>{
        !barLoad && getDataLabel()
    }, [listData])

    return(
        <>
            <div className='Main'>
            <div className='HeadText'>Charts and Table Visualization</div>
                
                <div className='Wrapper'>
                <div className='FormInput'>
                    <div className='FormWrapper'>
                        <div className='FormLabel'>Name</div>
                        <input className='FormInputField' type="text" autoComplete="name" placeholder='Enter Your Name' value={nameForm} name={nameForm} onChange={(e)=>setNameForm(e.target.value)}/>
                    </div>
                    <div className='FormWrapper'>
                        <div className='FormLabel'>Category</div>
                        <select className='FormInputField' onChange={(e)=>setCatForm(e.target.value)}>
                            <option >Select Category</option>
                            {Category.map((option,index) => (
                                <option key={index+1} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className='FormWrapper'>
                        <div className='FormLabel'>Availability</div>

                        <div className='RadioList'>
                        <Radio text="Available" toogle={()=>setAvailForm(0)} active={!availForm? true : false} />

                        <Radio text="Full" toogle={()=>setAvailForm(1)} active={availForm? true : false} />
                        </div>
                    </div>
                    
                    <div className='FormWrapper'>
                    <div className='FormLabel'>Arrival</div>
                        <input className='FormInputField' style={{backgroundColor:"#f8f8f8"}} disabled placeholder={`Value Hasn't Arrived`} />
                    </div>
                    
                    <input onClick={()=>SubmitForm()} className='SubmitButton' type="submit" value="Submit Form" />
                </div>

                <div className='CategoryRatio'>
                    <div className='HeadBar'>Category Ratio </div>
                    <div className='BannerRatio'>
                        {barLoad && barlist.map((item,index)=>(
                        <div key={index+1} className='BannerContent'>
                            <div className='BannerHead'>Category {index+1}</div>
                            <div className='BannerData'>{item}</div>
                        </div>
                        ))
                        }
                    </div>

                    { barLoad && 
                    <BarData props={BarDataList} />
                    }
                </div>
                <div className='AvailRatio'>
                <div className='HeadBar'>Availability Ratio</div>
                    <div className='DounatWrap'>
                        {dounatLoad && 
                        <DounatData props={DounatDataList} />
                        }
                    </div>
                    <div className='PointWrapper'>
                        <div className='LabelWrap'>
                            <div className='PointA' />
                            <div className='PointText'>Available</div>
                        </div>
                        <div className='LabelWrap'>
                            <div className='PointB' />
                            <div className='PointText'>Full</div>
                        </div>
                    </div>
                    
                    <div className='PointWrapper'>
                    {dounatLoad && dounatList.map((item,index)=>(
                        <div key={index+1} className='PointData'>
                            {item}
                        </div>
                    ))
                    }
                    </div>
               
                </div>
            </div>

            <div>

            </div>
            {listData && 
    
                <div className='Table'>
                <div className="ListTableHead">
                    <div onClick={()=> !bulk ? BulkData() : CancelBulk()}>
                        {bulk ? 
                        <img src={Check} alt="Check" className='Selector' />
                        :
                        <div  className='SelectorWrapper' />
                        }
                    </div>
                    <div className='TableRowHead'>Name</div>
                    <div className='TableRowHead'>Category</div>
                    <div className='TableRowHead'>Availability</div>
                    <div className='TableRowHead'>Arrival</div>
                </div>

                {listData.map((item,index)=> {
                    return(
                    <div key={index+1} className={item.is_check === 1 ? "ListTableActive" : "ListTable"}>
                    <div onClick={()=>Checker(item._id)}>
                        {item.is_check === 1 
                        ? (<img src={Check} alt="Checkpng" className='Selector' />)
                        : (<div  className='SelectorWrapper' />)
                        }
                    </div>
                    <div className='TableRow'>{item.name}</div>
                    <div className='TableRow'>{item.category}</div>
                    <div className='TableRow'>{item.availability}</div>
                    <div className='TableRow'>{item.arrival_status}</div>
                </div>
                )})}

                </div>
                }
            

            {/* <Counter /> */}
            </div>

            {listCheck.length > 0 && 
            <div className='ModalWrapper'>
                <div className='Modal'>
                    <div className='LeftWrap'>
                        <img src={Close} alt="Close" className='Selector' /> 
                        <div className='SelectedText'>
                           {`${listCheck.length} `} Table Selected
                        </div>
                    </div>
                        
                    <div className='RightWrap'>
                        <div className='ButtonLabel'>
                        <img src={Label} alt="Label" className='Selector' /> 
                        Mark as Arrived
                        </div>
                        <div className='ButtonTrash'>
                        <img src={Trash} alt="Trash" className='Selector' /> 
                        Delete Table
                        </div>

                    </div>
                </div>
            </div>
            }

            <Cookies />
        </>
    )
}

export default Home;
