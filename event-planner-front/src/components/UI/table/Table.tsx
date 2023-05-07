import { FC, ReactNode } from "react";

interface ITableProps {
    headers?: string[] | ReactNode[];
    ceilsSchema: ((value: any) => string | ReactNode)[];
    data: any[][]
};

export const Table: FC<ITableProps> = ({ headers, ceilsSchema, data }) => {
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
                        <tr key={index}>
                            {
                                row.map((ceil, index) =>
                                <td key={index}>
                                    {
                                        ceilsSchema[index](ceil)
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
