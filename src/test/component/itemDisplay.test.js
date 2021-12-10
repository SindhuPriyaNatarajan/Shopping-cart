import { render } from '@testing-library/react';

import ItemDisplay from '../../component/itemDisplay';

describe('ItemDisplay', () => {

    const propsItem = {
        id: 23,
        title: "Item Title",
        category: "Item category",
        description: "Item description",
        price: 10,
        rating: {
            rate: 4,
            count: 10
        }
    }

    it('should render the item details', () => {
        const { getByText } = render(<ItemDisplay item={propsItem}/>);

        const title  = getByText("Item Title");
        expect(title).toBeInTheDocument();

        const description = getByText("Item description");
        expect(description).toBeInTheDocument();

        const price = getByText("£ 10");
        expect(price).toBeInTheDocument();

    })

})