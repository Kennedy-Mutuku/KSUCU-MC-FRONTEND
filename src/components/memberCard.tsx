import '../styles/christianMinds.css';

type MemberCardProps = {
    name: string;
    position: string;
    bio?: string;
    image?: string;
    yearOfStudy?: string;
    course?: string;
    isActive?: boolean; // To highlight the active card if needed
};

const MemberCard = ({ name, position, bio, image, yearOfStudy, course, isActive }: MemberCardProps) => {
    return (
        <div className={`member-card-new ${isActive ? 'active' : ''}`}>
            <div className="member-image-section">
                <img
                    src={image || "https://via.placeholder.com/300x400"}
                    alt={name}
                    className="member-profile-pic"
                />
            </div>

            <div className="member-details-section">
                <div className="member-header">
                    <div>
                        <h3 className="member-name-new">{name}</h3>
                        <p className="member-role-new">{position}</p>
                    </div>
                    {/* Age/Year badge if in design */}
                    {yearOfStudy && (
                        <div className="member-year-badge">
                            <span className="year-label">Year</span>
                            <span className="year-value">{yearOfStudy}</span>
                        </div>
                    )}
                </div>

                <div className="member-bio-new">
                    <p>{bio}</p>
                </div>

                <div className="member-info-grid">
                    <div className="info-item">
                        <span className="info-label">Education</span>
                        <p className="info-value">{course || "N/A"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberCard;
