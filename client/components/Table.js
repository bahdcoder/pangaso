import React from 'react'
import classnames from 'classnames'
import Paginate from 'react-paginate'

// components
import Svg from './Svg'
import Filters from './Filters'
import Checkbox from './Checkbox'

const Table = ({
    Link,
    resource,
    page = 1,
    total = 1,
    perPage,
    filters,
    rows = [],
    selectAll,
    resetFilters,
    headers = [],
    toggleSelect,
    onPageChange,
    selected = [],
    filtersActive,
    triggerRunAction,
    setSelectedAction,
    viewChildResource,
    triggerMultiDelete,
    selectedAction = '',
    handlePerPageChange,
    handleFilterChange
}) => {
    /**
     *
     * Get the total page count
     *
     * @var {Number}
     *
     */
    const pageCount = Math.ceil(total / perPage)

    /**
     *
     * Get the starting value of the current page
     *
     * @return {Number}
     *
     */
    const currentPageStart = perPage * page - perPage + 1

    /**
     *
     * Get the ending value of the current page
     *
     * @return {Number}
     *
     */
    const currentPageEnd =
        Math.round(total - currentPageStart) <= perPage
            ? total
            : currentPageStart + perPage - 1

    return (
        <div className="w-full bg-white rounded-t shadow mt-4">
            <div className="h-16 flex justify-between items-center">
                <div className="w-20 flex justify-center items-center">
                    <Checkbox
                        id="selectAll"
                        handler={selectAll}
                        disabled={rows.length === 0}
                        checked={
                            selected.length === rows.length && rows.length !== 0
                        }
                    />
                </div>

                <div className="flex items-center justify-end w-1/3">
                    {resource.actions.length > 0 && selected.length > 0 && (
                        <React.Fragment>
                            <select
                                onChange={setSelectedAction}
                                value={selectedAction.id || ''}
                                className="bg-white focus:outline-none text-gray-700 my-2 border border-gray-300 h-10 px-3 rounded-sm focus:outline-none focus:border-gray-400 focus:border-2 w-2/4"
                            >
                                <option value="">Select an action</option>
                                {resource.actions.map(action => (
                                    <option value={action.id} key={action.id}>
                                        {action.name}
                                    </option>
                                ))}
                            </select>

                            <button
                                type="button"
                                onClick={triggerRunAction}
                                disabled={!selectedAction.id}
                                className={classnames(
                                    'ml-3 focus:outline-none cursor-pointer trans-30 h-10 flex items-center justify-center rounded px-3',
                                    {
                                        'bg-gray-900 hover:bg-gray-700':
                                            selectedAction.id,
                                        'bg-gray-200 cursor-not-allowed': !selectedAction.id
                                    }
                                )}
                            >
                                <svg
                                    width={20}
                                    height={20}
                                    className="fill-current text-white font-bold h-10"
                                    xmlns="http://www.w3.org/2000/svg"
                                    id="Capa_1"
                                    x="0px"
                                    y="0px"
                                    viewBox="0 0 41.999 41.999"
                                    style={{
                                        enableBackground:
                                            'new 0 0 41.999 41.999'
                                    }}
                                    xmlSpace="preserve"
                                >
                                    <g>
                                        <path
                                            d="M36.068,20.176l-29-20C6.761-0.035,6.363-0.057,6.035,0.114C5.706,0.287,5.5,0.627,5.5,0.999v40  c0,0.372,0.206,0.713,0.535,0.886c0.146,0.076,0.306,0.114,0.465,0.114c0.199,0,0.397-0.06,0.568-0.177l29-20  c0.271-0.187,0.432-0.494,0.432-0.823S36.338,20.363,36.068,20.176z M7.5,39.095V2.904l26.239,18.096L7.5,39.095z"
                                            className="active-path"
                                        />
                                    </g>{' '}
                                </svg>
                            </button>
                        </React.Fragment>
                    )}

                    {selected.length > 0 && (
                        <div className="w-16 flex items-center justify-center">
                            <Svg
                                icon="trash"
                                onClick={triggerMultiDelete}
                                className="text-gray-800"
                            />
                        </div>
                    )}
                    <div className="flex items-center justify-center pr-6">
                        <Filters
                            perPage={perPage}
                            filters={filters}
                            resource={resource}
                            resetFilters={resetFilters}
                            filtersActive={filtersActive}
                            handleFilterChange={handleFilterChange}
                            handlePerPageChange={handlePerPageChange}
                        />
                    </div>
                </div>
            </div>

            <table className="w-full" cellSpacing="0" cellPadding="0">
                <thead className="w-full">
                    <tr className="bg-gray-200 w-full font-bold text-xs text-left uppercase border-b-2 tracking-wide align-middle">
                        <React.Fragment>
                            <th className="py-3 w-20 px-0" />
                            {headers.map((field, index) => (
                                <th className="py-3 px-0" key={index}>
                                    {field.name.toUpperCase()}
                                </th>
                            ))}
                            <th className="py-3 w-12 px-0" />
                        </React.Fragment>
                    </tr>
                </thead>

                <tbody>
                    {rows.map((row, index) => (
                        <tr
                            key={row[resource.primaryKey]}
                            className="transition duration-150 ease-in-out border-b border-gray-200 hover:bg-gray-200"
                        >
                            <React.Fragment>
                                <td className="text-left flex justify-center items-center w-20 h-14">
                                    <Checkbox
                                        value={row[resource.primaryKey]}
                                        handler={() => toggleSelect(row)}
                                        checked={selected.includes(
                                            row[resource.primaryKey]
                                        )}
                                        id={`table-item-${
                                            row[resource.primaryKey]
                                        }`}
                                    />
                                </td>
                                {headers.map((field, index) => {
                                    const DetailField =
                                        Lucent.details[field.detail]

                                    return DetailField ? (
                                        <td
                                            key={index}
                                            className="text-left h-14"
                                        >
                                            <DetailField
                                                table
                                                options={field.options}
                                                content={row[field.attribute]}
                                                checked={row[field.attribute]}
                                            />
                                        </td>
                                    ) : null
                                })}
                                <td className="text-left pr-6">
                                    <span className="flex items-center justify-end flex-grow">
                                        {viewChildResource ? (
                                            <Svg
                                                icon="eye"
                                                dataTestId={`view-resource-${index}`}
                                                className="trans-30 cursor-pointer text-gray-500 hover:text-gray-700"
                                                onClick={() =>
                                                    viewChildResource(
                                                        resource,
                                                        row[resource.primaryKey]
                                                    )
                                                }
                                            />
                                        ) : (
                                            <Link
                                                to={`/resources/${
                                                    resource.slug
                                                }/${
                                                    row[resource.primaryKey]
                                                }/details`}
                                                className="trans-30 cursor-pointer text-gray-500 hover:text-gray-700"
                                            >
                                                <Svg
                                                    icon="eye"
                                                    dataTestId={`view-resource-${index}`}
                                                />
                                            </Link>
                                        )}
                                        <Link
                                            to={`/resources/${resource.slug}/${
                                                row[resource.primaryKey]
                                            }/edit`}
                                            className="trans-30 text-gray-500 hover:text-gray-700 ml-3 cursor-pointer"
                                        >
                                            <Svg icon="pencil" />
                                        </Link>

                                        <Svg
                                            icon="trash"
                                            className="ml-3 text-gray-500 hover:text-gray-700"
                                            onClick={() =>
                                                triggerMultiDelete(
                                                    row[resource.primaryKey]
                                                )
                                            }
                                        />
                                    </span>
                                </td>
                            </React.Fragment>
                        </tr>
                    ))}
                    {rows.length === 0 && (
                        <tr className="my-12">
                            <td
                                colSpan={headers.length + 2}
                                data-testid="no-items-match-criteria"
                                className="text-center py-12 uppercase text-sm font-medium tracking-widest"
                            >
                                No items match your criteria
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="flex w-full justify-between rounded-b pr-6 bg-gray-200 shadow">
                <Paginate
                    nextLabel={'»'}
                    breakLabel={'...'}
                    previousLabel={'«'}
                    forcePage={page - 1}
                    pageCount={pageCount}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={2}
                    activeClassName={'active'}
                    onPageChange={onPageChange}
                    containerClassName={'paginator'}
                />

                <p className="text-grey-dark flex items-center">
                    {currentPageStart} - {currentPageEnd}
                    <span className="text-lg px-2">of</span> {total}
                </p>
            </div>
        </div>
    )
}

export default Table
