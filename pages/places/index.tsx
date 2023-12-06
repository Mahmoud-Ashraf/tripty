import HomeTabs from '@/components/HomeTabs/HomeTabs';
import { Place } from '@/interfaces/place';
import { Category } from '@/interfaces/category';
import PlaceHeader from '@/components/UI/PlaceHeader/PlaceHeader';
import Head from 'next/head';
import useHTTP from '@/hooks/use-http';
import { useEffect, useState } from 'react';

interface CategorizedPlaces {
    [categoryName: string]: Place[]; // Define the structure for categorized places
}

interface Props {
    tabs: Category[] | [],
    categorizedPlaces: CategorizedPlaces
}

const Places = (props: Props) => {
    const { isLoading, error, sendRequest } = useHTTP();
    const { tabs, categorizedPlaces } = props;
    const [newTabs, setNewTabs] = useState(tabs);
    const [newPlaces, setNewPlaces] = useState(categorizedPlaces);

    useEffect(() => {
        fetchPlaces();
    }, []);

    const fetchPlaces = () => {
        sendRequest(
            {
                url: '/api/places/categorized',
                method: 'GET'
            },
            (data: any) => {
                console.log('categorized', data);
                setNewPlaces(data.categorizedPlaces);
                setNewTabs(data.categories);
            },
            (err: any) => {
                // setNewTabs([]);
                // setNewPlaces({});
            }
        )
    }
    return (
        <>
            <Head>
                <title>{`Tripty - Places`}</title>
            </Head>
            <div>
                <PlaceHeader name='headings.places' />
                <HomeTabs tabs={newTabs} categorizedPlaces={newPlaces} />
            </div>
        </>
    )
}

export async function getStaticProps({ locale }: any) {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
        const categoriesReq = await fetch(`${baseUrl}categories?change_language=${locale}`);
        const categoriesData = await categoriesReq.json();
        categoriesData.data.unshift({ name: locale === 'ar' ? 'الكل' : 'all', id: 0, icon: '' });

        const categorizedPlaces: CategorizedPlaces = {}; // Initialize as the defined interface

        await Promise.all(categoriesData?.data?.map(async (category: any) => {
            const categoryPlacesReq = await fetch(`${baseUrl}places?change_language=${locale}&category_id=${category.id}`);
            const categoryPlacesData = await categoryPlacesReq.json();

            categorizedPlaces[category.name] = categoryPlacesData.data;
        }));
        return {
            props: {
                tabs: categoriesData.data,
                categorizedPlaces
            }
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            props: {
                tabs: [],
                categorizedPlaces: {} as CategorizedPlaces, // Initialize as the defined interface
            }
        };
    }
}

export default Places;