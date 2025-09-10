function Spinner() {
    return (
        <div className={'flex flex-col absolute inset-0 justify-center items-center bg-bg opacity-70 z-20'}>
            <div className={'border-2 border-[var(--color-primary-100)] w-5 h-5 rounded-full animate-spin border-t-transparent'}></div>
            <div>Loading...</div>
        </div>
    )
}

export default Spinner;
