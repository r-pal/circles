import { tableColumns, Column } from "./TableDetails";


const Table = () => {
    
    return(
        <table className="border-black">
            <thead>
                <tr>
                {tableColumns.map((c: Column) => <th key={c.id}>{c.header}</th>)}
                </tr>
            </thead>
            <tbody>
                <tr>
                {tableColumns.map((c: Column) => <td key={`${c.id}Content`}>{c.content}</td>)}
                </tr>
            </tbody>
        </table>
    )

}

export default Table;