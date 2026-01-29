import React from 'react';
import '../styles/christianMinds.css';


type MemberCardProps = {
  name: string;
  position: string;
  bio?: string;
};

const MemberCard = ({ name, position, bio }: MemberCardProps) => {
    return (
        <div className="member-card">
            <div className="member-content">
                <h3 className="member-name">{name}</h3>
                <p className="member-position">{position}</p>
                {bio && <p className="member-bio">{bio}</p>}
            </div>
        </div>
    );
};

export default MemberCard;
