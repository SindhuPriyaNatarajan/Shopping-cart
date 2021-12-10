import { useState } from "react";
import styled from "styled-components";
import ReactStars from "react-rating-stars-component";
import Modal from 'react-modal';

import ItemEdit from '../itemEdit';

const Container = styled.div`
background: white;
box-shadow: 0 1px 3px rgb(226 226 226 / 25%), 0 1px 2px rgb(226 226 226 / 50%);
width: 98%;
border-radius: 8px;
margin: 5px;
padding: 10px;
`

const ItemBody = styled.div`
display: flex;
flex-direction: row;
width: 100%;
padding-left: 5px;
border-radius: 3px;
margin-bottom: 5px;
`

const TitleRow = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
`

const Icon = styled.img`
width: 30px;
height: 30px;
`

const ItemImage = styled.img`
height: 150px;
min-width: 150px;
max-width: 150px;
margin: 10px 40px 40px 40px;

@media only screen and (max-width: 768px) {
height: 50px;
min-width: 50px;
max-width: 50px;
margin: 10px 10px 10px 10px;
}
`

const ItemDetails = styled.div`
display: flex;
flex-direction: column;
`

const ItemDesc = styled.div`
margin-top: 10px;
margin-bottom: 25px;
overflow-wrap: break-word;
font-size: large;
`

const ItemPrice = styled.div`
font-size: larger;
font-weight: bold;
`

const RatingRow = styled.div`
display: flex;
flex-direction: row;
align-items: center;
`

const RatingCount = styled.div`
margin-left: 5px;
`

const Close = styled.div`
display: flex;
justify-content: flex-end;
`

const CloseBtn = styled.button`
border: none;
background: transparent;
font-size: inherit;
`
const customModalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
    overlay: {
        backgroundColor: "rgba(20,20,20,0.8)"
    }
};

export default function ItemDisplay({ item }) {
    const [isModalOpen, setModalOpen] = useState(false);
    const { description, title, image, price, rating } = item;
    const imagSrc = image ? image : "/no-preview.png";

    /*
     * Function to open the pop up modal
     */
    const openModal = () => {
        setModalOpen(true);
    }

    /*
     * Function to close the pop up modal
     */
    const closeModal = () => {
        setModalOpen(false);
    }


    return (
        <Container>
            <TitleRow>
                <h2>{title}</h2>
                <Icon src={"/edit-icon.png"} onClick={openModal}></Icon>
            </TitleRow>

            <ItemBody>
                <ItemImage src={imagSrc} alt={title}></ItemImage>
                <ItemDetails>
                    <ItemDesc>{description}</ItemDesc>
                    <ItemPrice>{`£ ${price}`}</ItemPrice>
                    {rating.rate ? <RatingRow>
                        <ReactStars
                            count={rating.rate}
                            size={24}
                            color="#ffd700"
                            edit={false}
                            isHalf={true}
                            active={true}
                        ></ReactStars>
                        <RatingCount>{`(${rating.count})`}</RatingCount>
                    </RatingRow> : null}
                </ItemDetails>
            </ItemBody>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Edit"
                style={customModalStyles}
            >
                <Close>
                    <CloseBtn onClick={closeModal}>Close</CloseBtn>
                </Close>
                <ItemEdit item={item} closeModal={closeModal}></ItemEdit>
            </Modal>
        </Container>
    )
}