import classnames from 'classnames'
import React, { useState } from 'react'

const Textarea = ({ content, dataTestId }) => {
    const [show, toggleShow] = useState(false)

    return (
        <React.Fragment>
            {show && content}
            <span
                data-testid={dataTestId}
                onClick={() => toggleShow(!show)}
                className={classnames(
                    'text-indigo font-bold cursor-pointer hover:text-indigo-light trans-30',
                    {
                        'mt-4': show
                    }
                )}
            >
                {show ? 'Hide Content' : 'Show Content'}
            </span>
        </React.Fragment>
    )
}

export default Textarea
