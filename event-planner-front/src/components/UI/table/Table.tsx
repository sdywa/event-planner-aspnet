import clsx from "clsx";
import { FC, ReactNode } from "react";

interface ITableProps {
    headers?: string[] | ReactNode[];
    ceilsSchema: ((value: any) => string | ReactNode)[];
    data: any[],
    rowCallback?: (value: any) => void
};

export const Table: FC<ITableProps> = ({ headers, ceilsSchema, data, rowCallback }) => {
    return (
        <table>
            <tbody>
                {
                    headers &&
                    <tr>
                        {
                            headers.map((header, index) =>
                            <th key={index}>
                                { header }
                            </th>
                            )
                        }
                    </tr>
                }
                {
                    data.map((row, index) =>
                        <tr key={index} className={clsx(["hover:bg-slate-100 transition-colors duration-200 ease-in-out", rowCallback && "cursor-pointer"])} onClick={() => rowCallback && rowCallback(row)}>
                            {
                                ceilsSchema.map((schema, index) =>
                                <td key={index} className={clsx(["first:pl-4 first:rounded-l-md last:pr-4 last:rounded-r-md", headers && index >= headers.length && "w-0"])}>
                                    {
                                        schema(row)
                                    }
                                </td>)
                            }
                        </tr>
                    )
                }
            </tbody>
        </table>
    );
}
