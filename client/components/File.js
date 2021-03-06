import React from 'react'
import Button from '../components/Button'

class File extends React.Component {
    /**
     *
     * Define the default state
     *
     */
    state = {
        file: null
    }

    constructor() {
        super()

        this.file = React.createRef()
    }

    handleFileChange = e => {
        this.setState({
            file: event.target.files[0]
        })

        this.props.handler(e)
    }

    render() {
        const { file } = this.state
        const { name, error, value, dataTestId } = this.props

        return (
            <React.Fragment>
                <div className="flex items-center">
                    <Button
                        label={'Choose File'}
                        handler={() => this.file.current.click()}
                    />

                    {file && <span className="ml-4">{file.name}</span>}
                    {value && !file && (
                        <a
                            className="no-underline text-indigo hover:text-indigo-light ml-4"
                            href={value}
                            target="_blank"
                        >
                            {value}
                        </a>
                    )}
                </div>

                <input
                    type="file"
                    name={name}
                    ref={this.file}
                    data-testid={dataTestId}
                    style={{ display: 'none' }}
                    onChange={this.handleFileChange}
                />
                {error && (
                    <span
                        data-testid={`${dataTestId}-error`}
                        className="text-xs mt-3 text-red-600 font-light"
                    >
                        {error}
                    </span>
                )}
            </React.Fragment>
        )
    }
}

export default File
