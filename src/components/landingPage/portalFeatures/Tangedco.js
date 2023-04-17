/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import './PortalFeatures.css';

import img1 from '../../images/1.svg';
import img2 from '../../images/2.svg';
import img3 from '../../images/3.svg';

const Testimonial = ({ name, subHeading, detail }) => (
	<div
		style={{
			margin: 12,
			padding: 12,
			borderRadius: 8,
			maxWidth: 400,
			flexGrow: 1,
			border: 'solid 1px #eee',
		}}
	>
		<h4 style={{ fontSize: '1.1rem', marginBottom: 4 }}>{name}</h4>
		<h5 style={{ margin: 0, marginBottom: 16 }}>{subHeading}</h5>
		<div>{detail}</div>
	</div>
);

const User = ({ name, designation, faculty, about, email, linkedIn }) => (
	<div
		style={{
			margin: 12,
			padding: 12,
			borderRadius: 8,
			maxWidth: 350,
			flexGrow: 1,
			border: 'solid 1px #eee',
		}}
	>
		<div>
			<span style={{ fontSize: '1.1rem', marginRight: 8 }}>{name}</span>(
			{designation})
		</div>
		<div style={{ marginBottom: 12 }}>{about}</div>
		{faculty ? (
			<div style={{ marginBottom: 8 }}>
				<b>Faculty:</b> {faculty}
			</div>
		) : null}
		{linkedIn || email ? (
			<div>
				{linkedIn && (
					<a style={{ marginRight: 12 }} href={linkedIn}>
						LinkedIn
					</a>
				)}
				{email && <a href={`mailto:${email}`}>Email</a>}
			</div>
		) : null}
	</div>
);

export default class PortalFeatures extends Component {
	render = () => {
		return (
			<div className="portal-features-wrapper">
				<div style={{ margin: '64px 0px' }}>
					<div style={{ fontSize: 37, color: '#707070' }}>
						Guaranteed Success & Higher Percentile
					</div>
					<div style={{ fontSize: 37, color: 'black', fontWeight: 'bold' }}>
						Here's how...
					</div>
				</div>
				<div
					style={{ display: 'flex', margin: '8px 0px', alignItems: 'center' }}
					className="product-subwrapper"
				>
					<div style={{ flex: 1 }} className="product-subwrapper-text">
						<div style={{ fontSize: 32, color: '#2A2A2A' }}>
							Why to enroll for TANGEDCO-AE 2020 Test Series?
						</div>
						<div
							style={{
								fontSize: 18,
								color: '#707070',
								borderTop: '1px solid #707070',
								paddingTop: 8,
								marginTop: 12,
							}}
						>
							Getting exposed to computer based examinations gives confidence during
							the actual exam. It helps to improve your proficiency, speed and accuracy
							in solving problems. You can use this educational product to plan your
							preparation strategically [or] compete with other aspirants with our LIVE
							and MOCK exams to test your preparedness before appearing for the actual
							exam.
						</div>
					</div>
					<div style={{ display: 'none' }} className="margin-left">
						<img alt="" src={img1} className="portal-features-image"></img>
					</div>
				</div>
				<div
					style={{
						display: 'flex',
						margin: '0px 0px',
						marginTop: 128,
						alignItems: 'center',
					}}
					className="product-subwrapper-reverse"
				>
					<div style={{ display: 'none' }} className="margin-right">
						<img alt="" src={img2} className="portal-features-image"></img>
					</div>
					<div style={{ flex: 1 }} className="margin-right">
						<div style={{ fontSize: 32, color: '#0AABDC' }}>
							Modelled around TANGEDCO-AE 2015-2018
						</div>
						<div
							style={{
								fontSize: 18,
								color: '#707070',
								borderTop: '1px solid #707070',
								paddingTop: 8,
								marginTop: 12,
							}}
						>
							Our team of expert faculties has studied the previous year exam papers
							thoroughly to understand the pattern and standards of questions. The
							questions for the mock and live exams are designed very carefully from
							the topics that you can expect for the upcoming exam. Also, the exams are
							systematically designed to cover all the possible concepts in a
							particular topic. Attempting all the exams and thoroughly understanding
							the concepts behind each problem surely guarantees success
							<br />
							<br />
							<a
								rel="noopener noreferrer"
								href="http://103.61.230.220/rect17/answer.php"
								target="_blank"
							>
								Click here to download the previous year question papers.
							</a>
						</div>
					</div>
				</div>
				<div
					style={{
						display: 'flex',
						margin: '0px 0px',
						marginBottom: 64,
						alignItems: 'center',
					}}
					className="product-subwrapper last-product"
				>
					<div style={{ flex: 1 }} className="margin-right">
						<div style={{ fontSize: 32, color: '#0AABDC' }}>
							How to use the Test Series for your preparation?
						</div>
						<div
							style={{
								fontSize: 18,
								color: '#707070',
								borderTop: '1px solid #707070',
								paddingTop: 8,
								marginTop: 12,
							}}
						>
							If you are in the preparation phase, you may spend the majority of the
							time reading the textbooks and other reference materials. Once you have
							prepared a particular topic, take a TOPIC test and evaluate yourself. If
							your score is good, start preparing other topics and if your score is low
							then extra preparation is needed on that particular topic. You can devise
							a study plan and start practising the TOPIC and CHAPTER test.
							<br />
							<br />
							If you feel prepared for the exam, then it’s time to test yourself by
							attempting a full length mock exam. Practicing topic wise is different
							from taking up mock exams, it gives you a good analysis of your strong
							and weak topics. Prepare your weak topics and take another mock exam
							until you gain confidence.
						</div>
					</div>
					<div style={{ display: 'none' }} className="margin-left">
						<img alt="" src={img3} className="portal-features-image"></img>
					</div>
				</div>
				<div>
					<div>
						<h2>Can I avail any coupons or fee waiver?</h2>
						<p>
							We always encourage and support the deserving students as much as we can.
							You can send your 10th/12th/UG marksheet to onlinetangedco@gmail.com
							requesting for a fee waiver. We also give a free subscription for the few
							toppers who attempt our live examination.
							<br />
							We also encourage students who top the live exams by offering cash
							prizes.
						</p>
					</div>
					<div>
						<h2>When is the official exam expected to be announced?</h2>
						<p>
							We are not certain about the actual exam dates. But we expect the exam
							date will be notified in the month of December-2020 and may be conducted
							in the month of February/March 2021.
						</p>
					</div>
				</div>
				<div>
					<h1 style={{ textAlign: 'center' }}>Testimonials</h1>
					<div
						style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
					>
						<Testimonial
							name="Keerthana Varun(r.keerthiva***@gmail.com)"
							subHeading="Tue, Jul 28, 9:55 PM"
							detail="Though I have been preparing for quite some time, attending a live online test was a completely different experience. It helped me to manage my time effectively.  The complete analysis of each question provided by them, after the test, helped me to identify my mistakes and focus on rectifying it. Kudos to the onlinetangedco team for the meticulously planned test. I am looking forward to attending more tests in the future. Thank u"
						/>
						<Testimonial
							name="Kingsly Rajsingh"
							subHeading="Wed, Jul 29, 11:02 AM"
							detail={`Really a good mock test, but level of question is little bit higher level, so here after that start from level 1,2,3 kind of like, is really good i think, your analysis of our result is very useful, because we learn which area we lost and what area we have to improve...
Also we know the level of competition through ur topper list, this things gives some gist of confidence, so we get to continue our preparation process....
Also conduct topic wise mock test and more mock test.
Give some concession for toppers in upcoming test
`}
						/>
					</div>
				</div>
				<div style={{ margin: '16px 0' }}>
					<h1 style={{ textAlign: 'center' }}>About Team OnlineTangedco</h1>
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<p style={{ maxWidth: 800, textAlign: 'center' }}>
							We aim to deliver the high quality online resource material exclusively
							for TANGEDCO-AE aspirants. Our faculty team is highly dedicated and
							experienced with significant accomplishments.
						</p>
					</div>
					<div
						style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
					>
						<User
							name="Mr. Elangovan Gopal"
							designation="Team Lead"
							faculty="Engineering Mathematics"
							about="M.S Mechanical IIT Madras"
							email="math@onlinetangedco.com"
							linkedIn="https://linkedin.com/in/elankovanmg"
						/>
						<User
							name="Mr. Joyson Selvakumar"
							designation="Project Coordinator"
							faculty="Basic Engineering & Sciences"
							about="PhD Anna University"
							email="basic.engg@onlinetangedco.com"
							linkedIn="https://www.linkedin.com/in/joyson-s-3329a4175"
						/>
						<User
							name="Ms. Bhavya"
							designation="Faculty Head EE"
							about="ESE Mains cleared, GATE 96 percentile"
							faculty="Electrical Engineering"
							email="eee@onlinetangedco.com"
						/>
						<User
							name="Mr. Shyam Kumar"
							designation="Faculty Head ME"
							about="M.S Mechanical IIT Madras"
							faculty="Mechanical Engineering"
							email="mech@onlinetangedco.com"
						/>
						<User
							name="Mr. Dinesh Kumar"
							designation="Faculty Head CE"
							about="M. Tech, IIT Madras"
							faculty="Civil Engineering"
							email="civil@onlinetangedco.com"
						/>
						<User
							name="Ms. Devi Shankar"
							designation="Admin"
							about="B.Sc Computer Science SRM"
							email="admin@onlinetangedco.com"
						/>
					</div>
				</div>
			</div>
		);
	};
}
