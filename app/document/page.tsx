"use client";

import React, { useState } from 'react'
import TextInput from '@/components/shared/TextInput'
import Button from '@/components/shared/Button'
import styles from './Document.module.scss'
import { Column, FlexGrid, Row, Stack, Tile } from '@carbon/react';
import Dropdown from '@/components/shared/Dropdown';
import Table from '@/components/shared/Table';

const page = () => {
    const [inputValue1, setInputValue1] = useState('');
    const [inputValue2, setInputValue2] = useState('');
    const [selectedDropdownItem, setSelectedDropdownItem] = useState<{ id: string, text: string, value: string } | undefined>(undefined);

    const handleChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue1(e.target.value);
    };

    const handleChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue2(e.target.value);
    };

    const handleDropdownChange = (selectedItem: any) => {
        console.log('Selected item:', selectedItem);
        setSelectedDropdownItem(selectedItem);
    };

    const dropdownItems = [{
        id: '1',
        text: 'Option 1',
        value: 'value1'
    }
        ,
    {
        id: '2',
        text: 'Option 2',
        value: 'value1'
    }
        ,
    {
        id: '3',
        text: 'Option 3',
        value: 'value1'
    }
        ,
    ];

    const tableColumns = [
        { id: 'name', header: 'Name', key: 'name' },
        { id: 'age', header: 'Age', key: 'age' },
        { id: 'status', header: 'Status', key: 'status' },
    ];

    const tableData = [
        { id: '1', name: 'John Doe', age: 25, status: 'Active' },
        { id: '2', name: 'Jane Smith', age: 32, status: 'Inactive' },
        { id: '3', name: 'Bob Johnson', age: 45, status: 'Active' },
    ];


    return (
        <>
            {/* <h1>Shared Page</h1>
            <p>This is the shared page content.</p> */}

            <div className={`${styles.mainPage}`}>
                <FlexGrid>
                    <Row className={styles.mainGrid}>

                        <Column lg={10} md={10} sm={4}>
                            <Tile className={styles.loginTile}>
                                <Stack gap={7}>
                                    <div className={styles.headerWrapper}>
                                        <h1 className={styles.title}>Document Page</h1>
                                    </div>
                                    <Column className={styles.inputColButton}>
                                        <TextInput
                                            id="example-input-1"
                                            name="example1"
                                            type="text"
                                            labelText="First Input"
                                            placeholder="Enter text here"
                                            required={true}
                                            value={inputValue1}
                                            onChange={handleChange1}
                                        /><Button size='md'>Sub</Button>
                                    </Column>
                                    <TextInput
                                        id="example-input-2"
                                        name="example2"
                                        type="text"
                                        labelText="Second Input"
                                        value={inputValue2}
                                        onChange={handleChange2}
                                    />
                                    <Column>
                                        <Dropdown
                                            id="dropdown-example"
                                            items={dropdownItems}
                                            onChange={handleDropdownChange}
                                            placeholder="Select an option"
                                            titleText="Select from options"
                                        />
                                    </Column>
                                    {selectedDropdownItem && (
                                        <Column>
                                            <Table
                                                columns={tableColumns}
                                                data={tableData}
                                            />
                                        </Column>
                                    )}
                                </Stack>
                            </Tile>
                        </Column>
                    </Row>
                </FlexGrid>
            </div>
        </>
    )
}

export default page