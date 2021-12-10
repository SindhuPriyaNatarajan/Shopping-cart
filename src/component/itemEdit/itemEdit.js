import { useState } from "react";
import styled from "styled-components";

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { addNewItem, updateItem } from '../../store/items';

const Container = styled.div`
display: flex;
flex-direction: column;
align-items: center;
`
const Row = styled.div`
display: flex;
flex-direction: row;
align-items: center;
margin: 15px;
`
const ErrorText = styled.label`
color: red;
`

const Label = styled.label`
min-width: 100px;
`

const Mandatory = styled.span`
color: red;
`

const Input = styled.input`
width: 200px;
height: 25px;
`

const TextArea = styled.textarea`
width: 200px;
height: 70px;
`

const Button = styled.button`
width: 120px;
height: 40px;
font-size: initial;
background-color: #094e78;
color: #ffff;
border-radius: 3px;
border: none;
`

const SecondaryBtn = styled.button`
width: 120px;
height: 40px;
font-size: initial;
background-color: #6c757d;
color: #ffff;
border-radius: 3px;
border: none;
margin-left: 7px;
`

const ButtonRow = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-end;
margin: 50px 15px 15px 15px;
`

export default function ItemEdit({ item, closeModal }) {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [inputValues, setInputValues] = useState(
        {
            ...item
        }
    );
    const [isError, setError] = useState(false);

    const handleInputChange = (e, name) => {
        setInputValues({ ...inputValues, [name]: e.target.value });
    }

    /*
     * Function to add/update item
     */
    const onSave = () => {
        const { title, category, description, price } = inputValues;
        if (title && category && description && price) {
            setError(false);
            if (item.id) {
                // update flow
                const updatedItem = {
                    ...item,
                    title: title,
                    category: category,
                    description: description,
                    price: price,
                }
                dispatch(updateItem(updatedItem));
            } else {
                // add flow
                const newItem = {
                    id: Math.random(),
                    title: title,
                    category: category,
                    description: description,
                    price: price,
                    rating: {
                        rate: 0,
                        count: 0
                    }
                }
                dispatch(addNewItem(newItem));
            }
            if (closeModal) {
                // close edit modal - edit flow
                closeModal();
            } else {
                // navigate back to home - add flow
                navigate("/");
            }
        } else {
            setError(true);
        }

    }

    const onCancel = () => {
        if (closeModal) {
            closeModal();
        } else {
            navigate("/");
        }
    }


    return (
        <Container>
            {item.id === null ? <h2>Add New Item</h2> : <h2>Edit Item</h2>}

            <div>
                {isError ?
                    <Row>
                        <ErrorText>Please fill in all the required input values.</ErrorText>
                    </Row> :
                    null}
                <Row>
                    <Label>Title <Mandatory>*</Mandatory></Label>
                    <Input value={inputValues.title} onChange={(e) => handleInputChange(e, 'title')}></Input>
                </Row>
                <Row>
                    <Label>Category <Mandatory>*</Mandatory></Label>
                    <Input value={inputValues.category} onChange={(e) => handleInputChange(e, 'category')}></Input>
                </Row>
                <Row>
                    <Label>Description <Mandatory>*</Mandatory></Label>
                    <TextArea value={inputValues.description} onChange={(e) => handleInputChange(e, 'description')}></TextArea>
                </Row>
                <Row>
                    <Label>Price <Mandatory>*</Mandatory></Label>
                    <Input type="number" value={inputValues.price} onChange={(e) => handleInputChange(e, 'price')}></Input>
                </Row>
                <ButtonRow>
                    <Button onClick={onSave}>Save</Button>
                    <SecondaryBtn onClick={onCancel}>Cancel</SecondaryBtn>
                </ButtonRow>
            </div>
        </Container>
    )
}

ItemEdit.defaultProps = {
    item: {
        id: null,
        title: '',
        category: '',
        description: '',
        price: 0,
    },
    closeModal: null
}