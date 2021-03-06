import React from 'react'
import classnames from 'classnames'
import QueryString from 'query-string'
import { debounce } from 'throttle-debounce'

class Resource extends React.Component {
    state = {
        data: {
            total: 0,
            data: []
        },
        filters: this.getDefaultFilters(),
        selected: [],
        isFetching: true,
        selectedAction: {},
        multiDeleting: false,
        runningAction: false,
        currentlyDeleting: '',
        resource: this.getCurrentResource(),
        page: this.getQueryParams().page || 1,
        perPage:
            this.getQueryParams().per_page || this.getCurrentResource().perPage,
        query: this.getQueryParams().query || ''
    }

    /**
     *
     * Get parsed query parameters
     *
     */
    getQueryParams() {
        return QueryString.parse(this.props.location.search)
    }

    /**
     *
     * Get all the query params
     *
     * @return {Object}
     *
     */
    params = () => QueryString.parse(this.props.location.search)

    /**
     *
     * Get stringified version of params
     *
     * @return {string}
     *
     */
    paramsString = () =>
        QueryString.stringify({
            page: this.state.page || 1,
            query: this.state.query || '',
            per_page: this.state.perPage || 10
        })

    /**
     *
     * Fetch resource data when component is mounted
     *
     */
    async componentDidMount() {
        this.fetchData()
    }

    /**
     *
     * Get the current resource based on resource param
     *
     */
    getCurrentResource(slug = this.props.match.params.resource) {
        return (
            this.props.resource ||
            Lucent.resources.find(resource => resource.slug === slug)
        )
    }

    /**
     *
     * Trigger multi delete confirm modal
     *
     */
    triggerMultiDelete = (currentlyDeleting = null) =>
        this.setState({
            currentlyDeleting,
            multiDeleting: !this.state.multiDeleting
        })

    /**
     *
     * Trigger confirmation to run an action
     *
     */
    triggerRunAction = () =>
        this.setState({
            runningAction: !this.state.runningAction
        })

    /**
     *
     * Update the window location with the latest params
     *
     * @return {null}
     *
     */
    updateWindowLocation = () => {
        const { resource, history, location } = this.props

        !resource && history.push(`${location.pathname}?${this.paramsString()}`)
    }

    /**
     *
     * Update perPage value and refresh rows
     *
     * @return {null}
     */
    handlePerPageChange = perPage => {
        this.setState({ perPage }, () => this.fetchData())
    }

    /**
     *
     * Update filter in state
     *
     * @return {null}
     */
    handleFilterChange = event => {
        this.setState(
            {
                filters: {
                    ...this.state.filters,
                    [event.name]: event.value
                }
            },
            () => this.fetchData()
        )
    }

    getDefaultFilters() {
        const filters = {}

        this.getCurrentResource().filters.forEach(filter => {
            filters[filter.attribute] = filter.default
        })

        return filters
    }

    resetFilters = () => {
        this.setState(
            {
                isFetching: true,
                filters: this.getDefaultFilters()
            },
            this.fetchData
        )
    }

    filtersActive = () =>
        !(
            JSON.stringify(this.state.filters) ===
            JSON.stringify(this.getDefaultFilters())
        )

    buildFilters = () => {
        const filters = {}

        for (const key in this.state.filters) {
            if (this.state.filters.hasOwnProperty(key)) {
                const filter = this.state.filters[key]

                filters[`filters[${key}]`] = filter
            }
        }

        return filters
    }

    /**
     *
     * Fetch the data for a specific resource
     *
     */
    fetchData = debounce(500, () => {
        this.updateWindowLocation()
        const { resource, parentRecord, parentResource, field } = this.props

        let url = resource
            ? `/resources/${parentResource.slug}/${
                  parentRecord[parentResource.primaryKey]
              }/has-many/${field.attribute}`
            : `resources/${this.props.match.params.resource}`

            Lucent.request()
            .get(url, {
                params: {
                    page: this.state.page,
                    query: this.state.query,
                    per_page: this.state.perPage,
                    ...this.buildFilters()
                }
            })
            .then(({ data }) => {
                this.setState({
                    data,
                    isFetching: false
                })
            })
    })

    /**
     *
     * Handle page change
     *
     */
    handlePageChange = ({ selected }) => {
        const { history, resource } = this.props

        const page = selected + 1

        /**
         *
         * If this is the resource page, then add the page
         * to query parameters
         *
         */
        if (!resource) {
            // history.push(`${history.location.pathname}?page=${page}`)
        }

        this.setState(
            {
                page,
                selected: [],
                isFetching: true
            },
            () => this.fetchData()
        )
    }

    /**
     * Fetch data for new resource if resource param has changed.
     *
     * @param {ResourcePropsInterface} nextProps
     *
     * @return {void}
     *
     */
    componentWillReceiveProps(nextProps) {
        if (
            nextProps.match.params.resource !== this.props.match.params.resource
        ) {
            this.setState(
                {
                    page: 1,
                    query: '',
                    selected: [],
                    isFetching: true,
                    runningAction: false,
                    multiDeleting: false,
                    currentlyDeleting: '',
                    resource: this.getCurrentResource(
                        nextProps.match.params.resource
                    ),
                    filters: this.getDefaultFilters(),
                    perPage: this.getQueryParams().per_page || this.getCurrentResource().perPage,
                },
                () => this.fetchData()
            )
        }
    }

    handleQueryChange = event => {
        this.setState(
            {
                isFetching: true,
                query: event.target.value
            },
            () => {
                this.updateWindowLocation()
                this.fetchData()
            }
        )
    }

    /**
     *
     * Search the server with specific query
     *
     * @return {null}
     *
     */
    search = debounce(500, () => {
        const { resource } = this.props
        const { query, page, history, location } = this.state

        history.push(`${location.pathname}`)

        Lucent.request()
            .get(`/resources/${resource.slug}/search?query=${query}`)
            .then(({ data }) => {})
    })

    /**
     *
     * Set the selected action
     *
     * @param {React.SyntheticEvent} event
     *
     */
    setSelectedAction = (event = null) => {
        const selectedAction = this.state.resource.actions.find(
            action => action.id === ((event || {}).target || {}).value
        )

        this.setState({
            selectedAction: selectedAction || {}
        })
    }

    /**
     * Delete resources
     *
     */
    delete = () => {
        Lucent.request()
            .delete(`/resources/${this.state.resource.slug}`, {
                data: {
                    resources:
                        this.state.selected.length > 0
                            ? this.state.selected
                            : [this.state.currentlyDeleting]
                }
            })
            .then(() => {
                this.setState(
                    {
                        selected: [],
                        isFetching: true,
                        multiDeleting: false,
                        currentlyDeleting: ''
                    },
                    () => this.fetchData()
                )

                Lucent.success(
                    `${this.state.resource.name}${
                        this.state.selected.length > 1 ? 's' : ''
                    } deleted !`
                )
            })
    }

    /**
     *
     * Select all rows
     *
     */
    selectAll = () => {
        this.setState({
            selected:
                this.state.selected.length === this.state.data.data.length
                    ? []
                    : this.state.data.data.map(
                          item => item[this.state.resource.primaryKey]
                      )
        })
    }

    /**
     *
     * Make API call to run a specific action
     * on a resource
     *
     */
    runAction = () => {
        Lucent.request()
            .post(`/resources/${this.state.resource.slug}/run-action`, {
                resources: this.state.selected,
                action: this.state.selectedAction.id
            })

            /**
             *
             * Once action has be successfully run,
             * empty the selected list, and
             * the selectedAction
             *
             */
            .then(() => {
                this.setState(
                    {
                        selected: [],
                        isFetching: true,
                        selectedAction: '',
                        runningAction: false
                    },
                    () => this.fetchData()
                )

                Lucent.success('Action run !')
            })

            .catch(() => {
                this.setState({
                    runningAction: false
                })
            })
    }

    /**
     *
     * Get the fields shown for creation
     *
     * @return {array}
     *
     */
    getIndexFields = () =>
        this.state.resource.fields.filter(field => !field.hideOnIndexPage)

    /**
     *
     * Toggle select for an item
     *
     */
    toggleSelect = item => {
        const { primaryKey } = this.state.resource

        this.setState({
            selected: this.state.selected.includes(item[primaryKey])
                ? this.state.selected.filter(i => i !== item[primaryKey])
                : [...this.state.selected, item[primaryKey]]
        })
    }

    render() {
        const { Link, viewChildResource } = this.props
        const Svg = Lucent.components['component-svg']
        const Modal = Lucent.components['component-modal']
        const Table = Lucent.components['component-table']
        const Button = Lucent.components['component-button']
        const Loader = Lucent.components['component-loader']
        const {
            data,
            page,
            query,
            filters,
            perPage,
            resource,
            selected,
            runningAction,
            multiDeleting,
            selectedAction
        } = this.state

        return (
            <React.Fragment>
                <h3
                    data-testid={`resource-title-${resource.slug}`}
                    className={classnames('font-thin text-gray-700 mb-2', {
                        'text-2xl': this.props.resource,
                        'text-3xl': !this.props.resource
                    })}
                >
                    {resource.title}
                </h3>

                <div className="flex justify-between items-center">
                    <div className="w-1/4 flex items-center">
                        <Svg
                            icon="lens"
                            className="absolute ml-5 z-5 text-gray-600"
                        />
                        <input
                            type="text"
                            value={query}
                            placeholder="Search"
                            onChange={this.handleQueryChange}
                            className="w-full text-grey-darkest my-3 pr-5 pl-12 py-3 rounded-full border focus:outline-none border-gray-300 focus:border-gray-400"
                        />
                    </div>

                    <Button
                        link
                        label={`Create new`}
                        to={`/resources/${resource.slug}/new`}
                        dataTestId={`create-resource-${resource.slug}`}
                    />
                </div>

                {this.state.isFetching ? (
                    <Loader />
                ) : (
                    <Table
                        page={page}
                        Link={Link}
                        rows={data.data}
                        filters={filters}
                        total={data.total}
                        resource={resource}
                        selected={selected}
                        selectAll={this.selectAll}
                        perPage={parseInt(perPage)}
                        headers={this.getIndexFields()}
                        selectedAction={selectedAction}
                        toggleSelect={this.toggleSelect}
                        resetFilters={this.resetFilters}
                        filtersActive={this.filtersActive()}
                        onPageChange={this.handlePageChange}
                        viewChildResource={viewChildResource}
                        triggerRunAction={this.triggerRunAction}
                        setSelectedAction={this.setSelectedAction}
                        triggerMultiDelete={this.triggerMultiDelete}
                        handleFilterChange={this.handleFilterChange}
                        handlePerPageChange={this.handlePerPageChange}
                    />
                )}
                <Modal
                    open={multiDeleting}
                    action={{
                        type: 'danger',
                        label: 'Delete',
                        handler: this.delete
                    }}
                    renderContent={() => (
                        <p className="text-grey-dark">
                            {`Are you sure you want to delete ${
                                selected.length > 1 || ''
                                    ? selected.length
                                    : 'this'
                            } resource${selected.length > 1 ? 's' : ''}?`}
                        </p>
                    )}
                    title="Delete Resource"
                    cancel={this.triggerMultiDelete}
                />
                <Modal
                    open={runningAction}
                    action={{
                        label: 'Run Action',
                        handler: this.runAction,
                        type: selectedAction.isDestructive
                            ? 'danger'
                            : 'primary'
                    }}
                    renderContent={() => (
                        <p className="text-grey-dark">
                            {`Are you sure you want to run this action on ${
                                selected.length
                            } resource${selected.length > 1 ? 's' : ''}?`}
                        </p>
                    )}
                    title={selectedAction.name}
                    cancel={() => {
                        this.setSelectedAction(null)

                        this.triggerRunAction()
                    }}
                />
            </React.Fragment>
        )
    }
}

export default Resource
