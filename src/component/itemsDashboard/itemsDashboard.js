import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { compact, countBy, map } from 'lodash';

import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';

import { setItems } from '../../store/items';

import ItemDisplay from "../itemDisplay/itemDisplay";


const Container = styled.div`
padding: 10px 70px 10px 70px;
display: flex;
flex-direction: row;
height: 95vh;
background: #f3f3f3;
@media only screen and (max-width: 768px) {
    padding: 8px;
}
`
const Filter = styled.div`
display: flex;
flex-direction: column;
width: 20%;
padding-right: 5px;
border-radius: 3px;
`

const CheckboxRow = styled.div`
display: flex;
flex-direction: row;
margin-bottom:10px;
`

const CheckboxLabel = styled.div`
margin-left: 5px;
`

const Checkbox = styled.input`
::after{
    backgound-color: red;
}
`

const PriceRow = styled.div`
display: flex;
flex-direction: row;
@media only screen and (max-width: 768px) {
flex-direction: column;
}
`

const PriceInput = styled.input`
width: 75px;
margin-right: 10px;
@media only screen and (max-width: 768px) {
width: 60px;
margin-bottom: 10px;
}
`

const FilterBtn = styled.button`
background:white;
border-radius:3px;
border: solid 0.5px;
`

const ItemSection = styled.div`
display: flex;
flex-direction: column;
width: 80%;
margin: 10px;
`

const AddRow = styled.div`
display: flex;
flex-direction: row;
justify-content: flex-end;
align-items: center;
`

const Button = styled.button`
width: 150px;
height: 40px;
font-size: initial;
background-color: #094e78;
color: #ffff;
border-radius: 3px;
border: none;
margin-bottom: 20px;
`
const ItemList = styled.div`
display: flex;
flex-direction: column;
padding-left: 5px;
border-radius: 3px;
overflow-y: scroll;
`

const LoadingOverlay = styled.div`
display: flex;
justify-content: center;
align-items: center;
position: fixed;
width: 100%;
height: 100%;
top: 0;
left: 0;
right: 0;
bottom: 0;
z-index: 2;
cursor: pointer;
background-color: rgba(20,20,20,0.8);
`

const LoadingIcon = styled.div`
border: 5px solid #f3f3f3;
border-radius: 50%;
border-top: 5px solid #094e78;
width: 20px;
height: 20px;
-webkit-animation: spin 2s linear infinite; /* Safari */
animation: spin 2s linear infinite;
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const isEmpty = (value) => {
    return value === undefined || value === '' || value === null
}

export default function ItemsDashboard() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const items = useSelector((state) => state.items.items);
    const [categories, setCategories] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [isLoading, setLoading] = useState(false);

    /*
     * Hook to make initial load api call
     */
    useEffect(() => {
        if (isEmpty(items)) {
            setLoading(true);
            axios.get("https://fakestoreapi.com/products")
                .then((response) => {
                    if (response.data) {
                        setLoading(false);
                        dispatch(setItems(response.data));
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    console.log("error", error);
                })
        }
    }, [])

    /*
     * Hook to calculate categories from the items list
     */
    useEffect(() => {
        const categoriesCount = countBy(items, (item) => item.category);

        setCategories(map(categoriesCount, (count, category) => {
            return {
                type: category,
                count: count,
                isChecked: false
            }
        }));

    }, [items]);


    /*
     * Function to apply filter when categories or price filter is selected
     */
    const applyFilter = () => {
        const selectedCategories = compact(map(categories, (o) => {
            if (o.isChecked) {
                return o.type;
            }
        }))

        if (selectedCategories.length > 0 || !isEmpty(priceMin) || !isEmpty(priceMax)) {
            const priceMinCheck = priceMin && priceMin !== '' ? priceMin : 0;
            const priceMaxCheck = priceMax && priceMax !== '' ? priceMax : Infinity;

            if (selectedCategories.length > 0) {
                setFilteredItems(items.filter(item =>
                    selectedCategories.includes(item.category) && priceMinCheck <= item.price && item.price <= priceMaxCheck
                ));
            } else {
                setFilteredItems(items.filter(item =>
                    priceMinCheck <= item.price && item.price <= priceMaxCheck
                ));
            }

        } else {
            setFilteredItems(items);
        }
    }

    /*
     * Hook to invoke apply filter when categories are selected
     */
    useEffect(() => {
        applyFilter();
    }, [categories])

    /*
     * Function invoked when category checkbox is updated
     */
    const onCheckboxChange = (type) => {
        const updatedCategories = map(categories, (o) => {
            if (o.type === type) {
                o.isChecked = !o.isChecked
            }
            return o;
        })
        setCategories(updatedCategories);
    }

    /*
     * Function invoked to add new item
     */
    const addNewItem = () => {
        navigate('/add');
    }

    return (
        <Container>
            {isLoading ?
                <LoadingOverlay>
                    <LoadingIcon />
                </LoadingOverlay> :
                null}

            <Filter>
                <h3>Filter By:</h3>
                <h4>Category</h4>
                {categories.map(({ type, count }) => (
                    <CheckboxRow key={type}>
                        <Checkbox type="checkbox" onClick={() => onCheckboxChange(type)} />
                        <CheckboxLabel>{type} ({count})</CheckboxLabel>
                    </CheckboxRow>
                ))}
                <h4>Price</h4>
                <PriceRow>
                    <PriceInput type="number" placeholder="min" value={priceMin} onChange={(e) => setPriceMin(e.target.value)}></PriceInput>
                    <PriceInput type="number" placeholder="max" value={priceMax} onChange={(e) => setPriceMax(e.target.value)}></PriceInput>
                    <FilterBtn onClick={() => applyFilter()} disabled={priceMax < priceMin}>Apply</FilterBtn>
                </PriceRow>
            </Filter>
            <ItemSection>
                <AddRow>
                    <Button onClick={addNewItem}>Add New</Button>
                </AddRow>
                {filteredItems && filteredItems.length > 0 ?
                    <ItemList>
                        {
                            filteredItems.map((item) => <ItemDisplay key={item.id} item={item}></ItemDisplay>)
                        }
                    </ItemList> : null
                }
            </ItemSection>
        </Container>
    )
}