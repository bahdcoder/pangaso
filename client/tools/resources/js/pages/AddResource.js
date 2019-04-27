import React from 'react'
import format from 'date-fns/format'
import { AxiosError, AxiosResponse } from 'axios'

class AddResource extends React.Component {
    state = {
        form: {},
        errors: {},
        resource: this.getCurrentResource(),
        editing: !!this.props.match.params.primaryKey
    }

    /**
     *
     * Set default values
     *
     * @return {void}
     *
     */
    componentDidMount() {
        if (this.state.editing) {
            return this.fetchEditingResource()
        }

        this.populateFields()
    }

    /**
     *
     * Populate fields
     *
     * @param {object} data
     *
     * @return {void}
     *
     */
    populateFields = (data = {}) => {
        const form = {}

        this.getCreationFields().forEach(field => {
            if (field.type === 'Date') {
                form[field.attribute] = format(
                    data[field.attribute] || new Date(),
                    this.getFormat(field)
                )

                return
            }

            if (field.type === 'Boolean') {
                form[field.attribute] = !!data[field.attribute] || false

                return
            }

            form[field.attribute] =
                data[field.attribute] || this.getDefaultFieldValue(field)
        })

        this.setState({
            form,
            errors: {}
        })
    }

    /**
     *
     * Get the default for a field
     *
     * @param {object} field
     *
     * @return {}
     *
     */
    getDefaultFieldValue(field) {
        if (field.type === 'HasOneEmbedded') {
            let attributes = {}

            field.fields.forEach(field => {
                attributes[field.attribute] = this.getDefaultFieldValue(field)
            })

            return attributes
        }

        if (field.type === 'Date') {
            return new Date()
        }

        if (field.type === 'Boolean') {
            return false
        }

        return ''
    }

    /**
     *
     * Get the current resource based on resource param
     *
     */
    getCurrentResource(slug = this.props.match.params.resource) {
        return Pangaso.resources.find(resource => resource.slug === slug)
    }

    /**
     *
     * Fetch the resource to be edited
     *
     */
    fetchEditingResource() {
        Pangaso.request()
            .get(
                `/resources/${this.state.resource.slug}/${
                    this.props.match.params.primaryKey
                }`
            )

            /**
             *
             * Populate fields when resource is fetched from api
             *
             */
            .then(({ data }) => {
                this.populateFields(data)
            })

            /**
             *
             * If there are any errors fetching fields, simply
             * redirectback to this resource page
             *
             */
            .catch(() => {
                Pangaso.error('Failed fetching resource.')

                this.props.history.push(
                    `/resources/${this.state.resource.slug}`
                )
            })
    }

    /**
     *
     * Post request to server to save resource
     *
     * @return {void}
     *
     */
    postResource = (redirect = true) => {
        Pangaso.request()
            .post(`resources/${this.state.resource.slug}`, this.state.form)
            .then(() => {
                Pangaso.success(`${this.state.resource.name} created !`)

                if (redirect) {
                    return this.props.history.push(
                        `/resources/${this.state.resource.slug}`
                    )
                }

                this.populateFields()
            })
            .catch(({ response }) => {
                if (response.status === 422) {
                    this.setState({
                        errors: response.data
                    })
                }
            })
    }

    /**
     *
     * Patch request to server to update resource
     *
     * @return {void}
     *
     */
    updateResource = (redirect = true) => {
        Pangaso.request()
            .put(
                `resources/${this.state.resource.slug}/${
                    this.props.match.params.primaryKey
                }`,
                this.state.form
            )
            .then(() => {
                Pangaso.success(`${this.state.resource.name} updated !`)

                if (redirect) {
                    return this.props.history.push(
                        `/resources/${this.state.resource.slug}/${
                            this.props.match.params.primaryKey
                        }/details`
                    )
                }
            })
            .catch(({ response }) => {
                if (response.status === 422) {
                    this.setState({
                        errors: response.data
                    })
                }
            })
    }

    /**
     *
     * @return {void}
     *
     */
    handleChange = (event, embedded = null) => {
        /**
         *
         * Handle the date field case
         *
         */
        if (event.name && event.date) {
            return this.setState({
                form: {
                    ...this.state.form,
                    [embedded ? embedded : event.name]: embedded ? {
                        ...this.state.form[embedded],
                        [event.name]: event.date
                    } : event.date,
                },
                errors: {
                    ...this.state.errors,
                    [event.name]: null
                }
            })
        }

        if (event.target.type === 'checkbox') {
            return this.setState({
                form: {
                    ...this.state.form,
                    [embedded ? embedded : event.target.name]: embedded ? {
                        ...this.state.form[embedded],
                        [event.target.name]: !this.state.form[embedded][event.target.name]
                    }: !this.state.form[event.target.name]
                }
            })
        }

        this.setState({
            form: {
                ...this.state.form,
                [embedded ? embedded : event.target.name]: embedded ? {
                    ...this.state.form[embedded],
                    [event.target.name]: event.target.value
                }: event.target.value
            },
            errors: {
                ...this.state.errors,
                [event.target.name]: null
            }
        })
    }

    /**
     *
     * Get the embedded fields
     *
     * @return {array}
     *
     */
    getEmbeddedFields = () =>
        this.state.resource.fields.filter(field =>
            ['HasOneEmbedded', 'HasManyEmbedded'].includes(field.type)
        )

    /**
     *
     * Get date format
     *
     * @param {Object} field
     *
     * @return {string}
     *
     */
    getFormat = field => `YYYY-MM-DD${field.enableTime ? ' mm:ss' : ''}`

    /**
     *
     * Get the fields shown for creation
     *
     * @return {array}
     *
     */
    getCreationFields = () =>
        this.state.resource.fields.filter(field => !field.hideOnCreationForm)

    /**
     *
     * Get the fields shown for update
     *
     * @return {array}
     *
     */
    getUpdateFields = () =>
        this.state.resource.fields.filter(field => !field.hideOnUpdateForm)

    /**
     *
     * Get a field from the component registry
     */
    getField = component => Pangaso.fields[component]

    /**
     *
     * Render add resource
     *
     */
    render() {
        const { editing, errors, form, resource } = this.state
        const Button = Pangaso.components['component-button']
        const Loader = Pangaso.components['component-loader']

        const embeddableFields = this.getEmbeddedFields()
        const formFields = editing
            ? this.getUpdateFields()
            : this.getCreationFields()

        // Only render the form once the form has been populated
        return (
            <React.Fragment>
                {Object.keys(form).length === 0 ? <Loader /> : (
                    <React.Fragment>
                        <h1 className="font-thin text-3xl mb-2">
                            {`${editing ? 'Edit' : 'New'}`} {resource.name}
                        </h1>

                        <div className="w-full mt-6 bg-white rounded-lg">
                            {formFields.map((field, index) => {
                                const Field = this.getField(field.component)

                                return Field ? (
                                    <div
                                        key={index}
                                        className="w-full border-b flex items-center border-grey-light py-6 px-12"
                                    >
                                        <label className="w-1/4 text-lg font-thin text-grey-dark">
                                            {field.name}
                                        </label>

                                        <div className="w-2/4 flex flex-col">
                                            <Field
                                                className="w-full"
                                                id={field.attribute}
                                                name={field.attribute}
                                                placeholder={field.name}
                                                handler={this.handleChange}
                                                value={form[field.attribute]}
                                                checked={form[field.attribute]}
                                                dateOptions={{
                                                    enableTime: field.enableTime
                                                }}
                                                error={errors[field.attribute]}
                                            />
                                        </div>
                                    </div>
                                ) : null
                            })}
                        </div>

                        {embeddableFields.map((embeddableField, index) => {
                            const formFields = embeddableField.fields

                            return (
                                <div key={index} className="mt-8">
                                    <h3 className="font-thin text-2xl">
                                        {embeddableField.name}
                                    </h3>

                                    <div className="w-full mt-6 bg-white rounded-lg">
                                        {formFields.map((field, index) => {
                                            const Field = this.getField(field.component)

                                            return Field ? (
                                                <div
                                                    key={index}
                                                    className="w-full border-b flex items-center border-grey-light py-6 px-12"
                                                >
                                                    <label className="w-1/4 text-lg font-thin text-grey-dark">
                                                        {field.name}
                                                    </label>

                                                    <div className="w-2/4 flex flex-col">
                                                        <Field
                                                            className="w-full"
                                                            id={field.attribute}
                                                            name={field.attribute}
                                                            placeholder={field.name}
                                                            handler={e => this.handleChange(e, embeddableField.attribute)}
                                                            value={
                                                                form[embeddableField.attribute][field.attribute]
                                                            }
                                                            checked={
                                                                form[embeddableField.attribute][field.attribute]
                                                            }
                                                            dateOptions={{
                                                                enableTime:
                                                                    field.enableTime
                                                            }}
                                                            error={
                                                                errors[field.attribute]
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            ) : null
                                        })}
                                    </div>
                                </div>
                            )
                        })}

                        <div className="p-8 flex justify-end bg-grey-lighter shadow mt-8">
                            <Button
                                handler={
                                    editing
                                        ? () => this.updateResource(false)
                                        : () => this.postResource(false)
                                }
                                label={
                                    editing
                                        ? 'Updated & Continue editing'
                                        : 'Create & Add another'
                                }
                                className="mr-6"
                            />
                            <Button
                                className="mr-6"
                                handler={
                                    editing ? this.updateResource : this.postResource
                                }
                                label={`${editing ? 'Update' : 'Create'} ${
                                    resource.name
                                }`}
                            />
                        </div>
                    </React.Fragment>
                )}
            </React.Fragment>
        )
    }
}

export default AddResource
