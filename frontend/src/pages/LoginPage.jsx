import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { login } from '../api/auth.api'

export default function LoginPage() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setError('');
        setLoading(true);

        try {
            const res = await login(data)
            localStorage.setItem('accessToken', res.data.data.accessToken)
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Email or password is not correct')
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page">
            {/* Left panel - decorative */}
            <div className="login-left">
                <div className="login-left-content">
                    <div className="login-illustration">✈️</div>
                    <h1 className="login-tagline">
                        Quản lý <span>booking</span><br />thông minh hơn
                    </h1>
                    <p className="login-desc">
                        Hệ thống ERP nội bộ dành cho đội ngũ<br />Mini Travel — đơn giản, nhanh, hiệu quả.
                    </p>
                </div>
            </div>

            {/* Right panel - form */}
            <div className="login-right">
                <div className="login-form-wrap">
                    <div className="login-logo">
                        <div className="login-logo-icon">✈️</div>
                        <span className="login-logo-text">Mini Travel ERP</span>
                    </div>

                    <h2 className="login-title">Đăng nhập</h2>
                    <p className="login-sub">Nhập thông tin tài khoản để tiếp tục</p>

                    {error && <div className="login-error">⚠️ {error}</div>}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                id="email"
                                className="form-input"
                                type="email"
                                placeholder="you@minitravel.com"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: { value: /\S+@\S+\.\S+/, message: 'Email is invalid' }
                                })}
                            />
                            {errors.email && <p className='form-error'>{errors.email.message}</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Mật khẩu</label>
                            <input
                                id="password"
                                className="form-input"
                                type="password"
                                placeholder="••••••••"
                                {...register('password', { required: 'Password is required' })}
                            />
                            {errors.password && <p className="form-error">{errors.password.message}</p>}
                        </div>

                        <button id="login-submit" type="submit" className="btn btn-primary login-btn" disabled={loading}>
                            {loading ? <><span className="spinner" /> Login...</> : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}