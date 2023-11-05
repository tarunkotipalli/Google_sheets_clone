const table1stRow=document.getElementById("table-1st-row");
const tableBody=document.getElementById("table-body");
let NoCellSelected=document.getElementById("noCellSelected");
// console.log(NoCellSelected);
let currentCell;
const cols=26;
//Adding column on the top of the table
for(let i=0;i<cols;i++)
{
    let thead=document.createElement('th');
    thead.innerText=String.fromCharCode(i+65);
    table1stRow.append(thead);

}
// //Adding rows on the right of the table

let rows=100;
for(let i=1;i<=rows;i++)
{   let tr=document.createElement('tr');
    let thead=document.createElement("th");
    thead.innerText=i;
    tr.append(thead);
    for(let j=0;j<cols;j++)
    {
        let tdata=document.createElement("td");
        tdata.setAttribute("contenteditable","true");//to make our cell editable we should right contenteditable=true;(super important)
        tdata.setAttribute('id',`${String.fromCharCode(j+65)}${i}`);
        tdata.addEventListener('input',(event)=>onInputFn(event));
        // this eventlisntener will trigger then we click or focusing any cell
        tdata.addEventListener("focus",(event)=>onFocus(event));
        tr.append(tdata);
    }
    tableBody.append(tr);
}
function updateMatrix(currentCell)
{
    let obj={
        style:currentCell.style.cssText,
        text:currentCell.innerText,
        id:currentCell.id
    }
    let  id=currentCell.id.split('');
    let i=id[1]-1;
    let j=id[0].charCodeAt(0)-65;
    matrix[i][j]=obj;
}
function onInputFn(event)
{
    updateMatrix(event.target);

    
}
// on focusing on the cell it will reflect the cell id
function onFocus(event){
    currentCell=event.target;
    NoCellSelected.innerText=currentCell.id;

}
// BOLD button
document.getElementById("boldBtn").addEventListener("click",()=>{
    if(currentCell.style.fontWeight==='bold')
    {
        currentCell.style.fontWeight='normal';
    }else{
        currentCell.style.fontWeight='bold';
    }
    updateMatrix(currentCell);
});
// Italics Button
document.getElementById("italicsBtn").addEventListener("click",()=>{
    if(currentCell.style.fontStyle==='italic')
    {
        currentCell.style.fontStyle='normal';
    }else{
        currentCell.style.fontStyle='italic';
    }
    updateMatrix(currentCell);
});
// Underline button
document.getElementById("underlineBtn").addEventListener("click",()=>{
    if(currentCell.style.textDecoration==='underline')
    {
        currentCell.style.textDecoration='none';
    }else{
        currentCell.style.textDecoration='underline';
    }
    updateMatrix(currentCell);
});
// left button
document.getElementById("leftBtn").addEventListener("click",()=>{
    currentCell.style.textAlign='left';
    updateMatrix(currentCell);
});
// Center button
document.getElementById("centerBtn").addEventListener("click",()=>{

    currentCell.style.textAlign='center';
    updateMatrix(currentCell);
});
// right button
document.getElementById("rightBtn").addEventListener("click",()=>{
    
    currentCell.style.textAlign='right';
    updateMatrix(currentCell);
})
// fontsize dropdown
document.getElementById("fontSize").addEventListener("change",()=>{
    currentCell.style.fontSize=document.getElementById("fontSize").value;
    updateMatrix(currentCell);
})
// font family dropdown
document.getElementById("fontFamily").addEventListener("change",()=>{
    currentCell.style.fontFamily=document.getElementById("fontFamily").value;
    updateMatrix(currentCell);
});
//cut functionality
let cutCell={};
let matrix=new Array(rows);
for(let i=0;i<rows;i++)
{
    matrix[i]=new Array(cols);
    for(let j=0;j<cols;j++)
    {
        matrix[i][j]={};
    }
}
// console.log(matrix);

document.getElementById("cut").addEventListener("click",()=>{
    // console.log(currentCell);
cutCell=
{
    style:currentCell.style.cssText,//iti will store with name like(font-family:arial);
    text:currentCell.innerText
}
currentCell.innerText='';
currentCell.style=null;
updateMatrix(currentCell);
});
//copy functionality
document.getElementById("copy").addEventListener("click",()=>{
    cutCell=
    {
        style:currentCell.style.cssText,//iti will store with name like(font-family:arial);
        text:currentCell.innerText
    }
});
// paste
document.getElementById("paste").addEventListener("click",()=>{
    if(cutCell.text)
    {
        currentCell.innerText=cutCell.text;
        currentCell.style=cutCell.style;
    }
    updateMatrix(currentCell);
});
document.getElementById("bgColor").addEventListener("input",()=>{
    // console.log(document.getElementById("bgColor").value);
    currentCell.style.backgroundColor=document.getElementById("bgColor").value; 
    updateMatrix(currentCell);
});
document.getElementById("textColor").addEventListener("change",()=>{
    // console.log(document.getElementById("bgColor").value);
    currentCell.style.color=document.getElementById("textColor").value; 
    updateMatrix(currentCell);
});
function downloadJson(){
     const matrixString=JSON.stringify(matrix);
     const blob=new Blob([matrixString],{type:'application/json'});
     const link = document.createElement('a');
     link.href = URL.createObjectURL(blob);
     link.download = 'table.json'; 
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
}
document.getElementById("jsonFile").addEventListener("change",readJSONfileFn);
 
function readJSONfileFn(event)
 {
    const file=event.target.files[0];
    if(file){
        const reader=new FileReader();
        reader.readAsText(file);
        reader.onload=function(e){
        const fileContent=e.target.result;
        // console.log(e.target);
            try{
                const fileContentJSON = JSON.parse(fileContent);
                matrix=fileContentJSON;
                console.log(matrix);
                // iterating over matrix and saving it in my html table
                fileContentJSON.forEach((row)=>{
                  row.forEach((cell)=>{
                    // cell is reflection object of my currentCell
                    // in matrix
                    if(cell.id){
                      // respecting currentCell of cell 
                      // in html or table
                      var currentCell = document.getElementById(cell.id);
                      currentCell.innerText=cell.text;
                      currentCell.style.cssText=cell.style;
                    }
                  })
                })
              }   
              catch(err){
                console.log('error in reading json file',err);
              }          
        }
    }
 }
 let numSheets=1;
 let currSheets=1;
 document.getElementById("add-sheet-btn").addEventListener("click",()=>{
    NoCellSelected.innerText="No cell Selected";
    if(numSheets===1)
    {
        let tempArr=[matrix];
        localStorage.setItem('arrMatrix',JSON.stringify(tempArr));
    }else{
        let prevArrMatrix=JSON.parse(localStorage.getItem('arrMatrix'));
        let updatedArr=[...prevArrMatrix,matrix];
        localStorage.setItem('arrMatrix',JSON.stringify(updatedArr));
    }
    numSheets++;
    currSheets=numSheets;
     for(let i=0;i<rows;i++)
     {
        matrix[i]=new Array(cols);
        for(let j=0;j<cols;j++)
        {
            matrix[i][j]={};
        }
     }
     tableBody.innerHTML='';
     for(let i=1;i<=rows;i++)
     {
        let tr=document.createElement("tr");
        let th=document.createElement("th");
        th.innerText=i;
        tr.append(th);
        for(let j=0;j<cols;j++)
        {
            let td=document.createElement("td");
            td.setAttribute('contenteditable','true');
            td.setAttribute('id',`${String.fromCharCode(j+65)}${i}`);
            td.addEventListener("input",(event)=>onInputFn(event));
            td.addEventListener('focus',(event)=>onFocus(event));
            tr.append(td);
            
        }
        tableBody.append(tr);
     }
     let button=document.createElement("button");
     button.className="sheetButton";
     button.id=`Sheet-${currSheets}`;
     button.innerText=`Sheet-${currSheets}`;
     document.getElementById("button").append(button);
    });