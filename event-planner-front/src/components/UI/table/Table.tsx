import { FC, ReactNode } from "react";

interface ITableProps {
    headers?: string[] | ReactNode[];
    ceilsSchema: ((value: any) => string | ReactNode)[];
    data: any[]
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
                                ceilsSchema.map((schema, index) =>
                                <td key={index}>
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
