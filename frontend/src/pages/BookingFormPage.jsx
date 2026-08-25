import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import dayjs from 'dayjs'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getBookingById, createBooking, updateBooking } from '../api/booking.api'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function BookingFormPage() {
  const { id } = useParams()
  const isEdit  = !!id
  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => getBookingById(id).then(r => r.data.data),
    enabled: isEdit
  })

  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      tourName: '',
      travelDate: null,
      totalPrice: '',
      notes: '',
    },
    values: booking ? {
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      tourName: booking.tourName,
      travelDate: booking.travelDate ? new Date(booking.travelDate) : null,
      totalPrice: booking.totalPrice,
      notes: booking.notes || '',
    } : undefined
  })

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        totalPrice: Number(data.totalPrice),
        travelDate: data.travelDate.toISOString()
      }

      if (isEdit) {
        await updateBooking(id, payload)
      } else {
        await createBooking(payload)
      }

      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      navigate('/bookings')
    } catch (err) {
      alert(err.response?.data?.message || 'Error occurred')
    }
  }

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <Navbar
          title={isEdit ? 'Edit Booking' : 'Create New Booking'}
          subtitle={isEdit ? `Booking #${id}` : 'Fill in customer and tour information'}
          leftSlot={
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/bookings')}>
              ← Back
            </button>
          }
        />

        {isLoading && isEdit && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-light)' }}>Loading...</div>
        )}

        <div className="card" style={{ maxWidth: 720 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* ── Customer Information ── */}
            <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-heading)', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
              👤 Customer Information
            </h2>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input 
                  id="customerName" 
                  className="form-input" 
                  placeholder="Enter customer full name" 
                  {...register('customerName', { required: 'Customer full name is required' })}
                />
                {errors.customerName && <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 4 }}>{errors.customerName.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Phone <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input 
                  id="customerPhone" 
                  className="form-input" 
                  placeholder="Enter customer phone" 
                  {...register('customerPhone', { required: 'Customer phone is required' })}
                />
                {errors.customerPhone && <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 4 }}>{errors.customerPhone.message}</p>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input 
                id="customerEmail" 
                className="form-input" 
                type="email" 
                placeholder="customer@email.com" 
                {...register('customerEmail', { required: 'Customer email is required' })}
              />
              {errors.customerEmail && <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 4 }}>{errors.customerEmail.message}</p>}
            </div>

            {/* ── Tour Information ── */}
            <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-heading)', margin: '28px 0 20px', paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
              🗺️ Tour Information
            </h2>

            <div className="form-group">
              <label className="form-label">Tour Name <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input 
                id="tourName" 
                className="form-input" 
                placeholder="Enter tour name" 
                {...register('tourName', { required: 'Tour name is required' })}
              />
              {errors.tourName && <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 4 }}>{errors.tourName.message}</p>}
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Travel Date <span style={{ color: 'var(--danger)' }}>*</span></label>
                <Controller
                  control={control}
                  name="travelDate"
                  rules={{ required: 'Travel date is required' }}
                  render={({ field }) => (
                    <DatePicker
                      id="travelDate"
                      className="form-input"
                      placeholderText="Select a date"
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      dateFormat="dd/MM/yyyy"
                    />
                  )}
                />
                {errors.travelDate && <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 4 }}>{errors.travelDate.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Total Price (VND) <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input 
                  id="totalPrice" 
                  className="form-input" 
                  type="number" 
                  min="0" 
                  step="1000" 
                  placeholder="5000000" 
                  {...register('totalPrice', { required: 'Total price is required', min: 1, valueAsNumber: true })}
                />
                {errors.totalPrice && <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 4 }}>{errors.totalPrice.message}</p>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea 
                id="notes" 
                className="form-input" 
                rows={3} 
                placeholder="Enter notes" 
                {...register('notes')}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/bookings')}>
                Cancel
              </button>
              <button id="submit-btn" type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isEdit ? '💾 Save changes' : '✅ Create booking'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
