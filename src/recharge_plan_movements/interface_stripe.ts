export interface Metadata {
    line_items: LineItem[];
    metadata:   Metadatum[];
}

export interface LineItem {
    price_data: PriceData;
    quantity:   number;
}

export interface PriceData {
    currency:     string;
    unit_amount:  number;
    product_data: ProductDatum[];
}

export interface ProductDatum {
    name:        string;
    description: string;
}

export interface Metadatum {
    simId:             string;
    planId:            string;
    userId:            string;
    iccid:             string;
    planDays:          string;
    originalAmount:    string;
    simName:           string;
    transactionNumber: string;
}