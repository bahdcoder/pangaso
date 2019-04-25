import * as React from 'react'
import * as ReactModal from 'react-modal'

import Button from './Button'

interface ModalPropsInterface {
    open: boolean
    title: string
    renderFooter?(): any
    renderContent?(): any
    action?: {
        type: string
        label: string
    }
    cancel?(): any
}

ReactModal.setAppElement('#app')

const Modal: React.FunctionComponent<ModalPropsInterface> = ({
    open = false,
    title = '',
    renderFooter,
    renderContent,
    action,
    cancel
}) => (
    <ReactModal
        isOpen={open}
        className="mx-auto mt-16 focus:outline-none justify-center w-full h-full"
        overlayClassName="fixed pin-t pin-b pin-l pin-r bg-grey-darkest-modal"
    >
        <div className="bg-white rounded-lg shadow w-full max-w-sm mx-auto">
            <div className="p-8">
                <h4 className="font-thin text-xl mb-8">{title}</h4>
                {renderContent && renderContent()}
            </div>
            <footer className="w-full flex bg-grey-lighter justify-end rounded-b-lg px-8 py-4">
                {renderFooter && renderFooter()}
                {!renderFooter && (
                    <React.Fragment>
                        <button
                            onClick={cancel}
                            className="bg-transparent mr-6 text-grey-dark focus:outline-none"
                        >
                            Cancel
                        </button>
                        <Button {...action} />
                    </React.Fragment>
                )}
            </footer>
        </div>
    </ReactModal>
)

export default Modal
