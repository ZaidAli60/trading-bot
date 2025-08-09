import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import {
    WalletOutlined,
    RiseOutlined,
    FallOutlined,
    ThunderboltOutlined,
} from '@ant-design/icons';
import {
    LineChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
} from 'recharts';
import Chart from './Chart';
// import TradingViewWidgetWithSignals from './TradingViewChart';

const { Title } = Typography;

const Home = () => {
    // Sample dynamic data (replace with your actual API/logic)

    const walletData = [
        { day: 'Mon', value: 8000 },
        { day: 'Tue', value: 500 },
        { day: 'Wed', value: 9000 },
        { day: 'Thu', value: 5000 },
        { day: 'Fri', value: 10450 },
    ];

    const profitData = [
        { day: 'Mon', value: 1000 },
        { day: 'Tue', value: 10000 },
        { day: 'Wed', value: 5000 },
        { day: 'Thu', value: 8500 },
        { day: 'Fri', value: 9000 },
    ];

    const lossData = [
        { day: 'Mon', value: 20 },
        { day: 'Tue', value: 45 },
        { day: 'Wed', value: 76 },
        { day: 'Thu', value: 110 },
        { day: 'Fri', value: 142 },
    ];

    const tradeData = [
        { day: 'Mon', value: 10000 },
        { day: 'Tue', value: 0 },
        { day: 'Wed', value: 8000 },
        { day: 'Thu', value: 10000 },
        { day: 'Fri', value: 5823 },
    ];


    const renderChart = (data, color) => (
        <ResponsiveContainer width="100%" height={80}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" hide />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    );

    return (
        <div className="p-4">
            <Row gutter={[24, 24]}>
                {/* Wallet Balance */}
                <Col xs={24} sm={12} md={12} lg={6}>
                    <Card className="shadow-sm rounded-lg">
                        <Title level={5}>
                            <WalletOutlined /> Total Wallet Balance: $10,450
                        </Title>
                        {renderChart(walletData, '#8b5cf6')}
                    </Card>
                </Col>

                {/* Profit */}
                <Col xs={24} sm={12} md={12} lg={6}>
                    <Card className="shadow-sm rounded-lg">
                        <Title level={5}>
                            <RiseOutlined /> Total Profit: $3,275
                        </Title>
                        {renderChart(profitData, '#10b981')}
                    </Card>
                </Col>

                {/* Loss Trades */}
                <Col xs={24} sm={12} md={12} lg={6}>
                    <Card className="shadow-sm rounded-lg">
                        <Title level={5}>
                            <FallOutlined /> Loss Trades: 142
                        </Title>
                        {renderChart(lossData, '#ef4444')}
                    </Card>
                </Col>

                {/* Total Trades Executed */}
                <Col xs={24} sm={12} md={12} lg={6}>
                    <Card className="shadow-sm rounded-lg">
                        <Title level={5}>
                            <ThunderboltOutlined /> Trades Executed: 5,823
                        </Title>
                        {renderChart(tradeData, '#3b82f6')}
                    </Card>
                </Col>
            </Row>
            <div className="mt-3">
                <Row gutter={[]}>
                    <Col span={24}>
                        <h3 className="mb-3">Trading Chart with Signals</h3>
                        {/* <TradingViewWidgetWithSignals /> */}
                        <Chart />
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Home;

