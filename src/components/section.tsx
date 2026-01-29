import React from 'react';

const Section = ({ id, title, children, background = 'white' }) => {
    const bgClass = background === 'gray' ? 'bg-gray' : 'bg-white';

    return (
        <section id={id} className={bgClass}>
            <div className="container">
                {title && <h2 className="section-title">{title}</h2>}
                {children}
            </div>
        </section>
    );
};

export default Section;
